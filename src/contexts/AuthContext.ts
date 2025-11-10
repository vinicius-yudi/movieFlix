import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { loadUsers, saveUsers, setSession, getSession } from "../storage";
import type { User } from "../types";
import { demoHash } from "../utils/hash";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string, photoUri?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  pickPhoto: () => Promise<string | undefined>;
  takePhoto: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const users = await loadUsers();
      const current = await getSession();
      const u = users.find(x => x.id === current) || null;
      setUser(u);
      setLoading(false);
    })();
  }, []);

  const register = async (name: string, email: string, password: string, photoUri?: string) => {
    const users = await loadUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      Alert.alert("Cadastro", "E-mail já cadastrado.");
      return;
    }
    const newUser: User = { id: `${Date.now()}`, name, email, passwordHash: demoHash(password), photoUrl: photoUri };
    const list = [...users, newUser];
    await saveUsers(list);
    setUser(newUser);
    await setSession(newUser.id);
  };

  const login = async (email: string, password: string) => {
    const users = await loadUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.passwordHash === demoHash(password));
    if (!u) {
      Alert.alert("Login", "Credenciais inválidas.");
      return;
    }
    setUser(u);
    await setSession(u.id);
  };

  const logout = async () => {
    setUser(null);
    await setSession(null);
  };

  const pickPhoto = async (): Promise<string | undefined> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permissão", "Precisamos da galeria para escolher foto."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (res.canceled) return;
    return res.assets?.[0]?.uri;
  };

  const takePhoto = async (): Promise<string | undefined> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permissão", "Precisamos da câmera para tirar foto."); return; }
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (res.canceled) return;
    return res.assets?.[0]?.uri;
  };

  const value = useMemo(() => ({ user, loading, register, login, logout, pickPhoto, takePhoto }), [user, loading]);
  return React.createElement(AuthContext.Provider, { value }, children);
}