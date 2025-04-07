import { ReactNode } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/authContext";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-xl font-bold text-foreground">TalentScout</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard">
                  <span className="text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-primary">
                    Dashboard
                  </span>
                </Link>
                <Link href="/videos">
                  <span className="text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                    Videos
                  </span>
                </Link>
                <Link href="/discover">
                  <span className="text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                    Discover
                  </span>
                </Link>
                <Link href="/messages">
                  <span className="text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                    Messages
                  </span>
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <ThemeSwitcher />
              <Link href="/profile">
                <span className="text-muted-foreground hover:text-foreground">
                  Profile
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 