import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FaFutbol, FaSearch, FaGraduationCap } from "react-icons/fa";

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-[url('/images/nigeria-stadium.jpg')] bg-cover bg-center"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Nigeria's Next Football Stars
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            The premier platform connecting Nigerian football talent with scouts and academies worldwide.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <Link href="/register">Join Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/discover">Discover Talent</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFutbol className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Players</h3>
              <p className="text-white/80">Showcase your skills and get discovered by top clubs</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Scouts</h3>
              <p className="text-white/80">Find the best Nigerian talent for your club</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Academies</h3>
              <p className="text-white/80">Connect with promising young players</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
