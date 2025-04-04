import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TrialsList from "@/components/trials/TrialsList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { FaPlus } from "react-icons/fa";
import { Link } from "wouter";
import { USER_ROLES } from "@shared/schema";

export default function Trials() {
  const { user } = useAuth();
  
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
      
      <TrialsList />
    </DashboardLayout>
  );
}
