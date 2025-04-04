import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TrialCardProps {
  trial: any;
  showApplyButton?: boolean;
}

export default function TrialCard({ trial, showApplyButton = true }: TrialCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Application mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/applications', {
        trialId: trial.id,
        message: `I am interested in applying for the ${trial.title} trial.`
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications/player'] });
      toast({
        title: "Application submitted",
        description: `You have successfully applied to ${trial.title}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "There was an error applying to this trial",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (user?.role !== "player") {
      toast({
        title: "Cannot apply",
        description: "Only players can apply to trials",
        variant: "destructive",
      });
      return;
    }
    
    applyMutation.mutate();
  };

  // Calculate match percentage (would come from the API in a real app)
  const matchPercentage = Math.floor(Math.random() * 30) + 70; // Random between 70-100%

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
      <div className="pitch-pattern h-24 relative p-4 flex items-center bg-gradient-to-r from-primary to-secondary">
        <div className="h-16 w-16 rounded-md bg-white p-1 shadow-sm flex items-center justify-center">
          {trial.imageUrl ? (
            <img 
              src={trial.imageUrl} 
              alt={trial.organization} 
              className="h-full w-full object-contain rounded"
            />
          ) : (
            <div className="font-bold text-primary text-xl">
              {trial.organization.charAt(0)}
            </div>
          )}
        </div>
        <div className="ml-3">
          <h4 className="font-bold text-white text-shadow">{trial.organization}</h4>
          <p className="text-sm text-white text-shadow">{trial.title}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="text-sm font-medium">{trial.position} Position</div>
          <Badge variant="outline" className={`
            ${matchPercentage >= 80 ? 'bg-green-100 text-green-800 border-green-200' : ''}
            ${matchPercentage >= 60 && matchPercentage < 80 ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
            ${matchPercentage < 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
          `}>
            {matchPercentage}% Match
          </Badge>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <FaMapMarkerAlt className="mr-1" />
          <span>{trial.location}</span>
          <span className="mx-2">•</span>
          <FaCalendarAlt className="mr-1" />
          <span>{format(new Date(trial.date), 'MMM dd, yyyy')}</span>
        </div>
        
        {showApplyButton ? (
          <Button 
            className="w-full" 
            onClick={handleApply}
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "Applying..." : "Apply Now"}
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/trials/${trial.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
