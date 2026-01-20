import { createFileRoute } from '@tanstack/react-router';
import { Search as SearchIcon, Star, Heart, Grid3x3, List, Play } from 'lucide-react';
import { useState } from 'react';
import { useSearchMovies, getImageUrl } from '@/hooks/use-movies';
import { useFavorites } from '@/hooks/use-favorites';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { IoIosPlay } from "react-icons/io";

function SearchPage() {
  const searchParams = Route.useSearch();
  const searchQuery = searchParams.q || '';
  const { data } = useSearchMovies(searchQuery);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      {searchQuery && data?.results && data.results.length > 0 && (
        <div className="flex justify-end mb-6 gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-5 h-5" />
          </Button>
        </div>
      )}

      {!searchQuery ? (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">Start searching for movies</p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <img src="/frame-55.png" alt="frame-55" className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Data Not Found</h1>
            <p className="text-muted-foreground mb-8">
              Try other keywords
            </p>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="flex flex-col gap-4">
          {data?.results.map((movie) => (
            <Link key={movie.id} to="/movie/$id" params={{ id: movie.id.toString() }}>
              <div className="relative flex gap-4 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(movie);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite(movie.id) ? 'fill-red-600 text-red-600' : 'text-foreground'
                      }`}
                  />
                </button>

                <div className="w-32 shrink-0">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-1 text-md mb-2">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {movie.overview}
                  </p>
                  <Link key={movie.id} to="/movie/$id/trailer" params={{ id: movie.id.toString() }}>
                    <Button size="lg" className="gap-2 rounded-full w-full sm:w-auto min-w-57.5 min-h-13 text-md">
                      Watch Trailer
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full">
                        <IoIosPlay className=" text-primary" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.results.map((movie) => (
            <Link key={movie.id} to="/movie/$id" params={{ id: movie.id.toString() }}>
              <div className="relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(movie);
                  }}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite(movie.id) ? 'fill-red-600 text-red-600' : 'text-foreground'
                      }`}
                  />
                </button>

                <div className="aspect-2/3 relative group/image">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/movie/${movie.id}/trailer`;
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Watch Trailer
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1 mb-1">{movie.title}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return {
      q: (search.q as string) || '',
    };
  },
});
