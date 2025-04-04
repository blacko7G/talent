import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FaUserGraduate, FaSearch, FaBuilding } from "react-icons/fa";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDYwMzUiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTYwIDMwQzYwIDEzLjQzMSA0Ni41NjkgMCAzMCAwIDEzLjQzMSAwIDAgMTMuNDMxIDAgMzBjMCAxNi41NjkgMTMuNDMxIDMwIDMwIDMwIDE2LjU2OSAwIDMwLTEzLjQzMSAzMC0zMHoiIHN0cm9rZT0iIzAwODA0MCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Football Scouting Platform</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Connecting players, scouts, and academies to elevate football talent worldwide
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6">Join as:</h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <FaUserGraduate className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Player</h3>
                    <p className="opacity-90">Showcase your skills to scouts worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <FaSearch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Scout</h3>
                    <p className="opacity-90">Discover hidden talent and manage recruitment</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <FaBuilding className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Academy</h3>
                    <p className="opacity-90">Post trials and manage player development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
