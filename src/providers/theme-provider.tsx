import {  useEffect, useState } from 'react';
import { ThemeProviderContext } from './theme-provider-context';

export type Theme = 'dark' | 'light';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
};

export function ThemeProvider({
    children,
    defaultTheme = 'dark',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
