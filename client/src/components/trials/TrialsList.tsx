import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import TrialCard from "@/components/trials/TrialCard";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FaSearch, FaFilter, FaMapMarkerAlt } from "react-icons/fa";

export default function TrialsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  
  // Fetch trials
  const { data: trialsData, isLoading } = useQuery({
    queryKey: ['/api/trials'],
  });

  // Fetch player's trial applications to filter out already applied trials
  const { data: applicationsData, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['/api/applications/player'],
  });

  const trials = trialsData?.trials || [];
  const applications = applicationsData?.applications || [];
  
  // Get IDs of trials the player has already applied to
  const appliedTrialIds = applications.map((app: any) => app.trialId);
  
  // Filter trials
  const filteredTrials = trials.filter((trial: any) => {
    // Search term filter
    const matchesSearch = 
      searchTerm === "" || 
      trial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Position filter
    const matchesPosition = 
      positionFilter === "" || 
      (trial.position && trial.position.toLowerCase() === positionFilter.toLowerCase());
    
    // Location filter
    const matchesLocation = 
      locationFilter === "" || 
      (trial.location && trial.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    return matchesSearch && matchesPosition && matchesLocation;
  });
  
  // Available positions (derived from trials data)
  const positions = [...new Set(trials.map((trial: any) => trial.position))].filter(Boolean);
  
  // Available locations (derived from trials data)
  const locations = [...new Set(trials.map((trial: any) => trial.location))].filter(Boolean);

  if (isLoading || isApplicationsLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search trials by name, organization, location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Positions</SelectItem>
                {positions.map((position: string) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <SelectValue placeholder="Filter by location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map((location: string) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              setSearchTerm("");
              setPositionFilter("");
              setLocationFilter("");
            }}
          >
            <FaFilter className="mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {filteredTrials.length} {filteredTrials.length === 1 ? 'trial' : 'trials'} found
        </p>
        <div className="text-sm">
          <span className="text-gray-500">Sort by: </span>
          <span className="font-medium text-primary cursor-pointer">Date</span>
        </div>
      </div>
      
      {/* Trials Grid */}
      {filteredTrials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrials.map((trial: any) => (
            <TrialCard 
              key={trial.id} 
              trial={trial} 
              showApplyButton={!appliedTrialIds.includes(trial.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border border-dashed border-gray-300">
          <h3 className="font-medium text-gray-900 mb-2">No trials found</h3>
          <p className="text-gray-500 mb-4">
            No trials match your current filters. Try adjusting your search criteria.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setPositionFilter("");
              setLocationFilter("");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
