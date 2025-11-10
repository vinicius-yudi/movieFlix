import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, RatedMovie } from "./types";

const USERS_KEY = "users";
const SESSION_KEY = "session_user_id";

export async function loadUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function setSession(userId: string | null): Promise<void> {
  if (userId) await AsyncStorage.setItem(SESSION_KEY, userId);
  else await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function loadRated(userId: string): Promise<RatedMovie[]> {
  const raw = await AsyncStorage.getItem(`rated:${userId}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveRated(
  userId: string,
  list: RatedMovie[]
): Promise<void> {
  await AsyncStorage.setItem(`rated:${userId}`, JSON.stringify(list));
}
