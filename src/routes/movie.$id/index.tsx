import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Star, Heart, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieDetails, useMovieCredits, getImageUrl } from '@/hooks/use-movies';
import { useFavorites } from '@/hooks/use-favorites';
import { Link } from '@tanstack/react-router';
import { IoIosPlay } from 'react-icons/io';

function MovieDetailsPage() {
  const { id } = Route.useParams();
  const movieId = parseInt(id);
  const { data: movie } = useMovieDetails(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="shrink-0 w-48 overflow-hidden">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-muted-foreground mb-4 italic">"{movie.tagline}"</p>
              )}

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {movie.vote_average.toFixed(1)}/10
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>

                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <Link to="/movie/$id/trailer" params={{ id: id }}>
                  <Button size="lg" className="gap-2 rounded-full min-w-57.5 min-h-13 text-md">
                    Watch Trailer
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full">
                      <IoIosPlay className=" text-primary" />
                    </span>
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleFavorite(movie)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="gap-2 rounded-full min-h-13 text-md"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite(movie.id) ? 'fill-red-600 text-red-600' : ''
                      }`}
                  />
                  {isHovered && (
                    <span className="whitespace-nowrap">
                      {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{movie.overview}</p>
      </section>

      {/* Cast & Crew */}
      {credits && credits.cast.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-6">Cast & Crew</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {credits.cast.slice(0, 10).map((person) => (
              <div key={person.id} className="flex flex-row overflow-hidden">
                <div className="aspect-2/3 relative bg-muted rounded-lg overflow-hidden">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path)}
                      alt={person.name}
                      className="w-17.25 h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-semibold text-sm line-clamp-1">{person.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {person.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export const Route = createFileRoute('/movie/$id/')({
  component: MovieDetailsPage,
});
