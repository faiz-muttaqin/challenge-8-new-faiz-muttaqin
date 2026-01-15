import { createFileRoute, Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMovieVideos, useMovieDetails } from '@/hooks/use-movies';

function TrailerPage() {
    const { id } = Route.useParams();
    const movieId = parseInt(id);
    const { data: videos } = useMovieVideos(movieId);
    const { data: movie } = useMovieDetails(movieId);

    const trailer = videos?.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    if (!trailer) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <img src="/frame-55.png" alt="frame-55" className="mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Trailer Not Available</h1>
                    <p className="text-muted-foreground mb-8">
                        Sorry, no trailer is available for this movie.
                    </p>
                    <Link to="/movie/$id" params={{ id: id }}>
                        <Button className='rounded-full min-w-57.5 min-h-13 text-lg'>Explore Movie</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-15">
            {/* <Link to="/movie/$id" params={{ id: id }}>
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                </Button>
            </Link> */}


            <div className="relative aspect-video w-full mx-auto bg-black rounded-lg overflow-hidden">
                <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>

            <div className='flex justify-between mt-4'>
                <div>
                    <h1 className="text-4xl font-bold mb-2">{movie?.title || 'Movie Trailer'}</h1>
                    <p className="text-lg text-muted-foreground mb-8">{trailer.name}</p>
                </div>
                <div className="mt-6 text-center">
                    <a
                        href={`https://www.youtube.com/watch?v=${trailer.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                        Watch on YouTube
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </div>
    );
}

export const Route = createFileRoute('/movie/$id/trailer')({
    component: TrailerPage,
});
