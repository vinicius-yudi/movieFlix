import type { Movie } from "../types";

const API_KEY = (
  typeof process !== "undefined"
    ? (process as any).env?.TMDB_API_KEY
    : (globalThis as any)?.TMDB_API_KEY
) as string;
const BASE = "https://api.themoviedb.org/3";

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];
  const res = await fetch(`${BASE}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`);
  const json = await res.json();
  return json.results || [];
}

export async function getMovie(id: number): Promise<Movie> {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
  return res.json();
}

export function posterUrl(path?: string | null, size: "w185"|"w342"|"w500"|"original" = "w342") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}