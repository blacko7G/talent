import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUserGraduate, FaSearch, FaBuilding } from "react-icons/fa";
import { USER_ROLES } from "@shared/schema";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";

export default function SelectRole() {
  const [, setLocation] = useLocation();
  const { user, updateUserRole } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleRoleSelect = async (role: string) => {
    try {
      setIsLoading(true);
      setSelectedRole(role);
      await updateUserRole(role);
      toast({
        title: "Role updated",
        description: "Your account role has been updated successfully!",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold">Select your role</h2>
          <p>Choose how you'll use TalentScout</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">What best describes you?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                  selectedRole === USER_ROLES.PLAYER
                    ? "border-primary bg-primary bg-opacity-5"
                    : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                }`}
                onClick={() => setSelectedRole(USER_ROLES.PLAYER)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  selectedRole === USER_ROLES.PLAYER
                    ? "bg-primary bg-opacity-10"
                    : "bg-gray-100"
                }`}>
                  <FaUserGraduate className={`text-xl ${
                    selectedRole === USER_ROLES.PLAYER ? "text-primary" : "text-gray-500"
                  }`} />
                </div>
                <h4 className="font-medium">Player</h4>
                <p className="text-sm text-gray-600 mt-1">Showcase your skills to scouts worldwide</p>
              </div>

              <div
                className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                  selectedRole === USER_ROLES.SCOUT
                    ? "border-primary bg-primary bg-opacity-5"
                    : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                }`}
                onClick={() => setSelectedRole(USER_ROLES.SCOUT)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  selectedRole === USER_ROLES.SCOUT
                    ? "bg-primary bg-opacity-10"
                    : "bg-gray-100"
                }`}>
                  <FaSearch className={`text-xl ${
                    selectedRole === USER_ROLES.SCOUT ? "text-primary" : "text-gray-500"
                  }`} />
                </div>
                <h4 className="font-medium">Scout/Agent</h4>
                <p className="text-sm text-gray-600 mt-1">Discover talent and manage recruitment</p>
              </div>

              <div
                className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                  selectedRole === USER_ROLES.ACADEMY
                    ? "border-primary bg-primary bg-opacity-5"
                    : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                }`}
                onClick={() => setSelectedRole(USER_ROLES.ACADEMY)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  selectedRole === USER_ROLES.ACADEMY
                    ? "bg-primary bg-opacity-10"
                    : "bg-gray-100"
                }`}>
                  <FaBuilding className={`text-xl ${
                    selectedRole === USER_ROLES.ACADEMY ? "text-primary" : "text-gray-500"
                  }`} />
                </div>
                <h4 className="font-medium">Academy Admin</h4>
                <p className="text-sm text-gray-600 mt-1">Post trials and manage development</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              className="w-full md:w-auto" 
              disabled={!selectedRole || isLoading}
              onClick={() => selectedRole && handleRoleSelect(selectedRole)}
            >
              {isLoading ? "Updating..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 