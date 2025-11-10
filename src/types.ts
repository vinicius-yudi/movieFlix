export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    photoUrl?: string;
}

export type Movie = {
    id: number;
    title: string;
    poster_Path?: string;
    backdrop_Path?: string;
    overview?: string;
    release_Date?: string;
    vote_Average?: number;
    runtime?: number;
    genres?: { id: number; name: string }[];
}

export type RatedMovie = {
    movieId: number;
    rating: number;
    ratedAt: string;
}

