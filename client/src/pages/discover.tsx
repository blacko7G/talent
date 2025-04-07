import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import PlayersList from "@/components/discover/PlayersList";
import PlayerDetails from "@/components/discover/PlayerDetails";
import { FaSearch, FaFilter, FaMapMarkerAlt } from "react-icons/fa";

interface PlayerProfile {
  id: string;
  name: string;
  age: number;
  position: string;
  location: string;
  club: string;
  achievements: string[];
  videoUrl?: string;
  isEliteProspect?: boolean;
  isVerified?: boolean;
}

interface Player {
  id: string;
  profile: PlayerProfile;
}

interface PlayersResponse {
  players: Player[];
}

const nigerianLocations = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Ibadan",
  "Benin City",
  "Calabar",
  "Enugu",
  "Kaduna",
  "Warri"
];

const positions = [
  "Goalkeeper",
  "Right Back",
  "Left Back",
  "Center Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Striker"
];

const ageGroups = [
  "Under-15",
  "Under-17",
  "Under-20",
  "Under-23",
  "Senior"
];

export default function Discover() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  
  const { data, isLoading, error } = useQuery<PlayersResponse>({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await fetch("/api/players");
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return response.json();
    }
  });

  const players = data?.players || [];
  
  const filteredPlayers = players.filter((player: Player) => {
    const matchesSearch = player.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.profile.club.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = selectedPosition === "all" || player.profile.position === selectedPosition;
    const matchesLocation = selectedLocation === "all" || player.profile.location === selectedLocation;
    const matchesAgeGroup = selectedAgeGroup === "all" || 
                          (selectedAgeGroup === "Under-15" && player.profile.age <= 15) ||
                          (selectedAgeGroup === "Under-17" && player.profile.age <= 17) ||
                          (selectedAgeGroup === "Under-20" && player.profile.age <= 20) ||
                          (selectedAgeGroup === "Under-23" && player.profile.age <= 23) ||
                          (selectedAgeGroup === "Senior" && player.profile.age > 23);

    return matchesSearch && matchesPosition && matchesLocation && matchesAgeGroup;
  });
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPosition("all");
    setSelectedLocation("all");
    setSelectedAgeGroup("all");
  };
  
  const selectPlayer = (playerId: number) => {
    setSelectedPlayerId(playerId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error loading players. Please try again later.</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Nigerian Talent</h1>
          <p className="text-gray-600">Find and scout talented players</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search players by name or club..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Position</label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All positions</SelectItem>
                      {positions.map((position: string) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        <SelectValue placeholder="All locations" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      {nigerianLocations.map((location: string) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Age Group</label>
                  <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ages</SelectItem>
                      {ageGroups.map((ageGroup: string) => (
                        <SelectItem key={ageGroup} value={ageGroup}>
                          {ageGroup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={resetFilters}
                >
                  <FaFilter className="mr-2" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Discovery Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Players</span>
                  <span className="font-bold">{players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elite Prospects</span>
                  <span className="font-bold">{players.filter((p: Player) => p.profile?.isEliteProspect).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified Players</span>
                  <span className="font-bold">{players.filter((p: Player) => p.profile?.isVerified).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Watchlist</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {/* Results */}
          <Tabs defaultValue="grid" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {filteredPlayers.length} {filteredPlayers.length === 1 ? 'player' : 'players'} found
              </p>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                {selectedPlayerId && (
                  <TabsTrigger value="details">Player Details</TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <PlayersList 
                players={filteredPlayers} 
                isLoading={isLoading} 
                viewType="grid" 
                onSelectPlayer={selectPlayer}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <PlayersList 
                players={filteredPlayers} 
                isLoading={isLoading} 
                viewType="list" 
                onSelectPlayer={selectPlayer}
              />
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              {selectedPlayerId && (
                <PlayerDetails 
                  playerId={selectedPlayerId} 
                  onBack={() => setSelectedPlayerId(null)}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
