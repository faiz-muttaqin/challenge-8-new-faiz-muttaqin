import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from '@/providers/theme-provider';
import { Navbar } from '@/components/navbar';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
});
