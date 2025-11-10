import React,{ createContext, useContext, useEffect, useState } from "react";
import type { RatedMovie, Movie } from "../types";
import { loadRated, saveRated } from "../storage";
import { useAuth } from "./AuthContext";

type MoviesCtx = {
  rated: RatedMovie[];
  rateMovie: (movie: Movie, rating: number) => Promise<void>;
};

const MoviesContext = createContext<MoviesCtx | undefined>(undefined);
export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
};

export function MoviesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [rated, setRated] = useState<RatedMovie[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) { setRated([]); return; }
      const list = await loadRated(user.id);
      setRated(list);
    })();
  }, [user]);

  const rateMovie = async (movie: Movie, rating: number) => {
    if (!user) return;
    const existingIdx = rated.findIndex(r => r.movieId === movie.id);
    const item: RatedMovie = { movieId: movie.id, rating, ratedAt: new Date().toISOString() };
    let next = [] as RatedMovie[];
    if (existingIdx >= 0) {
      next = rated.slice();
      next[existingIdx] = item;
    } else {
      next = [item, ...rated];
    }
    setRated(next);
    await saveRated(user.id, next);
  };
    const value = { rated, rateMovie };
    return React.createElement(MoviesContext.Provider, { value }, children);

}