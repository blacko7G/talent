import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import PlayerDashboard from "@/components/dashboard/PlayerDashboard";
import ScoutDashboard from "@/components/dashboard/ScoutDashboard";
import AcademyDashboard from "@/components/dashboard/AcademyDashboard";
import { USER_ROLES } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Helper function to render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case USER_ROLES.PLAYER:
        return <PlayerDashboard />;
      case USER_ROLES.SCOUT:
        return <ScoutDashboard />;
      case USER_ROLES.ACADEMY:
        return <AcademyDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      ) : isAuthenticated ? (
        renderDashboard()
      ) : (
        <div>Redirecting to login...</div>
      )}
    </DashboardLayout>
  );
}
