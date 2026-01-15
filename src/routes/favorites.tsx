import { createFileRoute } from '@tanstack/react-router';
import { Heart, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useFavorites } from '@/hooks/use-favorites';
import { getImageUrl } from '@/hooks/use-movies';
import { Link } from '@tanstack/react-router';

function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-8">Favorites</h1>
                <div className="text-center py-20">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">No favorites yet</p>
                    <p className="text-muted-foreground mt-2">
                        Start adding movies to your favorites!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Favorites</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {favorites.map((movie) => (
                    <Link key={movie.id} to="/movie/$id" params={{ id: movie.id.toString() }}>
                        <Card className="relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(movie);
                                }}
                                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                            >
                                <Heart className="w-4 h-4 fill-red-600 text-red-600" />
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
        </div>
    );
}

export const Route = createFileRoute('/favorites')({
    component: FavoritesPage,
});
