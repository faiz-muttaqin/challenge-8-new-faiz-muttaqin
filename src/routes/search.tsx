import { createFileRoute } from '@tanstack/react-router';
import { Search as SearchIcon, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSearchMovies, getImageUrl } from '@/hooks/use-movies';
import { useFavorites } from '@/hooks/use-favorites';
import { Link } from '@tanstack/react-router';

function SearchPage() {
  const searchParams = Route.useSearch();
  const [query, setQuery] = useState(searchParams.q || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
  const { data } = useSearchMovies(searchQuery);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Movies</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </form>

      {!searchQuery ? (
        <div className="text-center py-20">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">Start searching for movies</p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.results.map((movie) => (
            <Link key={movie.id} to="/movie/$id" params={{ id: movie.id.toString() }}>
              <Card className="relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(movie);
                  }}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(movie.id) ? 'fill-red-600 text-red-600' : 'text-foreground'
                    }`}
                  />
                </button>

                <div className="aspect-2/3 relative">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1 mb-1">{movie.title}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                </div>
              </Card>
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
