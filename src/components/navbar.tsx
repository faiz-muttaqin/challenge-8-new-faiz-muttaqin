import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, Moon, Search, Sun } from 'lucide-react';
import { RiTvFill } from "react-icons/ri";
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '@/hooks/use-theme';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate({ to: '/search', search: { q: searchQuery } });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-background/80 backdrop-blur-md'
                    : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <RiTvFill  className="w-8 h-8 " />
                        <span className="text-xl font-bold">The Movie</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-foreground hover:text-red-600 transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to="/favorites"
                            className="flex items-center gap-2 text-foreground hover:text-red-600 transition-colors font-medium"
                        >
                            <Heart className="w-4 h-4" />
                            Favorites
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background/50 border-0 min-w-60.75 min-h-14 rounded-lg"
                            />
                        </div>
                    </form>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-full"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50 backdrop-blur-sm"
                        />
                    </div>
                </form>
            </div>
        </nav>
    );
}
