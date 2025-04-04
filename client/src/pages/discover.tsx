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

export default function Discover() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  
  // Fetch all player profiles
  const { data, isLoading } = useQuery({
    queryKey: ['/api/profiles/player'],
    staleTime: 60000,
  });

  const players = data?.players || [];
  
  // Filter players
  const filteredPlayers = players.filter((player: any) => {
    // Search term filter
    const playerName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const matchesSearch = 
      searchTerm === "" || 
      playerName.includes(searchTerm.toLowerCase()) ||
      (player.profile?.position && player.profile.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (player.profile?.location && player.profile.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Position filter
    const matchesPosition = 
      positionFilter === "" || 
      (player.profile?.position && player.profile.position.toLowerCase() === positionFilter.toLowerCase());
    
    // Age filter
    const matchesAge = 
      ageFilter === "" || 
      (player.profile?.age && matchesAgeRange(player.profile.age, ageFilter));
    
    // Location filter
    const matchesLocation = 
      locationFilter === "" || 
      (player.profile?.location && player.profile.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    return matchesSearch && matchesPosition && matchesAge && matchesLocation;
  });
  
  // Helper for age range filtering
  function matchesAgeRange(playerAge: number, ageRange: string): boolean {
    if (ageRange === "u18") return playerAge < 18;
    if (ageRange === "18-21") return playerAge >= 18 && playerAge <= 21;
    if (ageRange === "22-25") return playerAge >= 22 && playerAge <= 25;
    if (ageRange === "26+") return playerAge >= 26;
    return true;
  }
  
  // Available positions (derived from players data)
  const positions = [...new Set(players
    .map((player: any) => player.profile?.position)
    .filter(Boolean))];
  
  // Available locations (derived from players data)
  const locations = [...new Set(players
    .map((player: any) => player.profile?.location)
    .filter(Boolean))];
    
  const resetFilters = () => {
    setSearchTerm("");
    setPositionFilter("");
    setAgeFilter("");
    setLocationFilter("");
  };
  
  const selectPlayer = (playerId: number) => {
    setSelectedPlayerId(playerId);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Players</h1>
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
                  placeholder="Search players by name, position, location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Position</label>
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All positions</SelectItem>
                      {positions.map((position: string) => (
                        <SelectItem key={position} value={position.toLowerCase()}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Age Group</label>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All ages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All ages</SelectItem>
                      <SelectItem value="u18">Under 18</SelectItem>
                      <SelectItem value="18-21">18-21</SelectItem>
                      <SelectItem value="22-25">22-25</SelectItem>
                      <SelectItem value="26+">26+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        <SelectValue placeholder="All locations" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All locations</SelectItem>
                      {locations.map((location: string) => (
                        <SelectItem key={location} value={location.toLowerCase()}>
                          {location}
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
                  <span className="font-bold">{players.filter((p: any) => p.profile?.isEliteProspect).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified Players</span>
                  <span className="font-bold">{players.filter((p: any) => p.profile?.isVerified).length}</span>
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
