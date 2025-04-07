import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TrialsList from "@/components/trials/TrialsList";
import { Link } from "wouter";
import { FaPlus } from "react-icons/fa";
import { USER_ROLES } from "@shared/schema";
import { useAuth } from "@/lib/authContext";

interface Trial {
  id: string;
  title: string;
  academy: string;
  location: string;
  date: string;
  ageGroup: string;
  positions: string[];
  description: string;
  requirements: string[];
}

interface Application {
  id: string;
  trialId: string;
  playerId: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

interface TrialsResponse {
  trials: Trial[];
}

interface ApplicationsResponse {
  applications: Application[];
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

export default function Trials() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");

  const { data: trialsData, isLoading: trialsLoading } = useQuery<TrialsResponse>({
    queryKey: ["trials"],
    queryFn: async () => {
      const response = await fetch("/api/trials");
      if (!response.ok) {
        throw new Error("Failed to fetch trials");
      }
      return response.json();
    }
  });

  const { data: applicationsData } = useQuery<ApplicationsResponse>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      return response.json();
    }
  });

  const filteredTrials = trialsData?.trials.filter(trial => {
    const matchesSearch = trial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trial.academy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === "all" || trial.location === selectedLocation;
    const matchesPosition = selectedPosition === "all" || trial.positions.includes(selectedPosition);
    const matchesAgeGroup = selectedAgeGroup === "all" || trial.ageGroup === selectedAgeGroup;

    return matchesSearch && matchesLocation && matchesPosition && matchesAgeGroup;
  });

  if (trialsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading trials...</div>
      </div>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Football Trials</h1>
          <p className="text-gray-600">Find and apply for football trials at top academies</p>
        </div>
        
        {user?.role === USER_ROLES.ACADEMY && (
          <Button asChild>
            <Link href="/trials/create" className="flex items-center">
              <FaPlus className="mr-2" />
              Post New Trial
            </Link>
          </Button>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search trials by title or academy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {nigerianLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                {ageGroups.map(ageGroup => (
                  <SelectItem key={ageGroup} value={ageGroup}>{ageGroup}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrials?.map(trial => {
          const application = applicationsData?.applications.find(app => app.trialId === trial.id);
          
          return (
            <Card key={trial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">{trial.title}</h3>
                  <p className="text-gray-600">{trial.academy}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{trial.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(trial.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">Age Group:</span>
                    <span>{trial.ageGroup}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">Positions:</span>
                    <span>{trial.positions.join(", ")}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {trial.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  {application ? (
                    <Button variant="outline" disabled>
                      {application.status === "pending" ? "Application Pending" :
                       application.status === "accepted" ? "Application Accepted" :
                       "Application Rejected"}
                    </Button>
                  ) : (
                    <Button>Apply Now</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
