import { useState } from "react";
import type { Movie } from "@/types/movie";

const FAVORITES_KEY = "movie-favorites";

export function useFavorites() {
	const [favorites, setFavorites] = useState<Movie[]>(() => {
		const stored = localStorage.getItem(FAVORITES_KEY);
		return stored ? JSON.parse(stored) : [];
	});

	const addFavorite = (movie: Movie) => {
		const newFavorites = [...favorites, movie];
		setFavorites(newFavorites);
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
	};

	const removeFavorite = (movieId: number) => {
		const newFavorites = favorites.filter((m) => m.id !== movieId);
		setFavorites(newFavorites);
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
	};

	const isFavorite = (movieId: number) => {
		return favorites.some((m) => m.id === movieId);
	};

	const toggleFavorite = (movie: Movie) => {
		if (isFavorite(movie.id)) {
			removeFavorite(movie.id);
		} else {
			addFavorite(movie);
		}
	};

	return {
		favorites,
		addFavorite,
		removeFavorite,
		isFavorite,
		toggleFavorite,
	};
}
