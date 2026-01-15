import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { IoIosPlay  } from "react-icons/io";
import { useQueries } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useTrendingMovies, getImageUrl } from '@/hooks/use-movies';
import { useFavorites } from '@/hooks/use-favorites';
import { api } from '@/lib/api';
import type { Movie, MoviesResponse } from '@/types/movie';

function HomePage() {
  const { data: trendingData } = useTrendingMovies('day');
  const [pages, setPages] = useState([1]);
  const [heroApi, setHeroApi] = useState<CarouselApi>();
  const [showScrollbar, setShowScrollbar] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const trending = trendingData?.results || [];

  // Fetch all pages using useQueries
  const queries = useQueries({
    queries: pages.map((page) => ({
      queryKey: ['movies', 'now-playing', page],
      queryFn: async () => {
        const { data } = await api.get<MoviesResponse>('/movie/now_playing', {
          params: { page },
        });
        return data;
      },
    })),
  });

  const allMovies = queries.flatMap((query) => query.data?.results || []);
  const lastQuery = queries[queries.length - 1];

  // Auto-scroll hero carousel
  useEffect(() => {
    if (!heroApi) return;

    const interval = setInterval(() => {
      heroApi.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [heroApi]);

  const loadMore = () => {
    setPages((prev) => [...prev, prev.length + 1]);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section - Trending Carousel */}
      <section className="relative w-full">
        <Carousel 
          setApi={setHeroApi} 
          className="w-full"
          opts={{
            loop: true,
            align: 'start',
          }}
        >
          <CarouselContent>
            {trending.slice(0, 5).map((movie) => (
              <CarouselItem key={movie.id}>
                <div className="relative h-[70vh] w-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                  </div>

                  <div className="relative container mx-auto px-4 h-full flex items-end pb-20">
                    <div className="min-w-2xl relative">
                      {/* Text shadow gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent -z-10 blur-xl" />
                      
                      <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg w-full">{movie.title}</h1>
                      <p className="text-lg md:text-xl text-muted-foreground mb-6 line-clamp-3 drop-shadow-md">
                        {movie.overview}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/movie/$id/trailer" params={{ id: movie.id.toString() }} className="w-full sm:w-auto">
                          <Button size="lg" className="gap-2 rounded-full w-full sm:w-auto min-w-57.5 min-h-13 text-md">  
                            Watch Trailer
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full">
                              <IoIosPlay  className=" text-primary" />
                            </span>
                          </Button>
                        </Link>
                        <Link to="/movie/$id" params={{ id: movie.id.toString() }} className="w-full sm:w-auto">
                          <Button size="lg" variant="outline" className="gap-2 rounded-full w-full sm:w-auto min-w-57.5 min-h-13 text-md">
                            See Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Trending Now - Horizontal Scroll */}
      <section 
        className="container mx-auto px-4 py-12"
        onMouseEnter={() => setShowScrollbar(true)}
        onMouseLeave={() => setShowScrollbar(false)}
      >
        <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
        <div className={`flex gap-4 overflow-x-auto pb-4 ${showScrollbar ? 'scrollbar-custom' : 'scrollbar-hide'}`}>
          {trending.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index + 1}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => toggleFavorite(movie)}
            />
          ))}
        </div>
      </section>

      {/* New Release - Vertical Grid with Load More */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">New Release</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => toggleFavorite(movie)}
            />
          ))}
        </div>

        {lastQuery.data && lastQuery.data.page < lastQuery.data.total_pages && (
          <div className="flex justify-center mt-8">
            <Button onClick={loadMore} size="lg" variant="outline">
              Load More
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function MovieCard({ movie, index, isFavorite, onToggleFavorite }: MovieCardProps) {
  return (
    <Link to="/movie/$id" params={{ id: movie.id.toString() }}>
      <div className="relative shrink-0 w-48 overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
        {index && (
          <div className="absolute top-2 left-2 z-10 bg-background/10 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center font-bold">
            {index}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-foreground'}`}
          />
        </button>

        <div className="aspect-2/3 relative">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});

