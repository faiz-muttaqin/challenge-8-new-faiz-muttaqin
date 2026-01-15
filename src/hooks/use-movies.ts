import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	MoviesResponse,
	MovieDetails,
	VideosResponse,
	CreditsResponse,
} from "@/types/movie";

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getImageUrl(
	path: string | null,
	size: "w500" | "original" = "w500"
) {
	if (!path) return "/placeholder-movie.jpg";
	return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Trending Movies
export function useTrendingMovies(timeWindow: "day" | "week" = "day") {
	return useQuery({
		queryKey: ["movies", "trending", timeWindow],
		queryFn: async () => {
			const { data } = await api.get<MoviesResponse>(
				`/trending/movie/${timeWindow}`
			);
			return data;
		},
	});
}

// Now Playing Movies
export function useNowPlayingMovies(page: number = 1) {
	return useQuery({
		queryKey: ["movies", "now-playing", page],
		queryFn: async () => {
			const { data } = await api.get<MoviesResponse>("/movie/now_playing", {
				params: { page },
			});
			return data;
		},
	});
}

// Movie Details
export function useMovieDetails(movieId: number) {
	return useQuery({
		queryKey: ["movie", movieId],
		queryFn: async () => {
			const { data } = await api.get<MovieDetails>(`/movie/${movieId}`);
			return data;
		},
		enabled: !!movieId,
	});
}

// Movie Videos
export function useMovieVideos(movieId: number) {
	return useQuery({
		queryKey: ["movie", movieId, "videos"],
		queryFn: async () => {
			const { data } = await api.get<VideosResponse>(
				`/movie/${movieId}/videos`
			);
			return data;
		},
		enabled: !!movieId,
	});
}

// Movie Credits
export function useMovieCredits(movieId: number) {
	return useQuery({
		queryKey: ["movie", movieId, "credits"],
		queryFn: async () => {
			const { data } = await api.get<CreditsResponse>(
				`/movie/${movieId}/credits`
			);
			return data;
		},
		enabled: !!movieId,
	});
}

// Search Movies
export function useSearchMovies(query: string, page: number = 1) {
	return useQuery({
		queryKey: ["movies", "search", query, page],
		queryFn: async () => {
			const { data } = await api.get<MoviesResponse>("/search/movie", {
				params: { query, page },
			});
			return data;
		},
		enabled: !!query,
	});
}
