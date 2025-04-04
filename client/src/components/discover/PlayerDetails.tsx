import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/authContext";
import { apiRequest } from "@/lib/queryClient";
import ProfileStats from "@/components/profile/ProfileStats";
import HighlightsList from "@/components/video/HighlightsList";
import { Link } from "wouter";
import { FaArrowLeft, FaStar, FaEnvelope, FaEye, FaUserPlus } from "react-icons/fa";
import { USER_ROLES } from "@shared/schema";

interface PlayerDetailsProps {
  playerId: number;
  onBack: () => void;
}

export default function PlayerDetails({ playerId, onBack }: PlayerDetailsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch player profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [`/api/profiles/player/${playerId}`],
  });
  
  // Fetch player videos
  const { data: videosData, isLoading: isVideosLoading } = useQuery({
    queryKey: [`/api/videos/user/${playerId}`],
  });
  
  // Scout interest mutation - for scouts to show interest in players
  const scoutInterestMutation = useMutation({
    mutationFn: async (interestType: string) => {
      const res = await apiRequest('POST', '/api/interests', {
        playerId,
        type: interestType,
        resourceId: null
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/interests/scout/${user?.id}`] });
      toast({
        title: "Interest recorded",
        description: "You've successfully shown interest in this player.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Action failed",
        description: error.message || "There was an error recording your interest",
        variant: "destructive",
      });
    },
  });
  
  const profile = profileData?.profile;
  const playerUser = profileData?.user;
  const videos = videosData?.videos || [];
  
  const isLoading = isProfileLoading || isVideosLoading;
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading player profile...</p>
      </div>
    );
  }
  
  if (!profile || !playerUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Player Not Found</h2>
        <p className="text-gray-600 mb-4">The player profile you're looking for doesn't exist.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }
  
  const handleScoutInterest = (interestType: string) => {
    if (user?.role !== USER_ROLES.SCOUT) {
      toast({
        title: "Action not allowed",
        description: "Only scouts can perform this action",
        variant: "destructive",
      });
      return;
    }
    
    scoutInterestMutation.mutate(interestType);
  };
  
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Search
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-card">
            <div className="bg-primary h-24 relative"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-white absolute -mt-12">
                  <AvatarImage src={playerUser.profileImage} alt={`${playerUser.firstName} ${playerUser.lastName}`} />
                  <AvatarFallback>{playerUser.firstName?.[0]}{playerUser.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-16 text-center">
                <h2 className="text-xl font-bold text-gray-900">{playerUser.firstName} {playerUser.lastName}</h2>
                <p className="text-sm text-gray-500">
                  {profile.position} • {profile.age} years • {profile.location}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  {profile.isEliteProspect && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Elite Prospect
                    </Badge>
                  )}
                  {profile.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-bold text-2xl stat-value">{profile.overallRating || 0}</div>
                  <div className="text-xs text-gray-500">Overall Rating</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{profile.appearances || 0}</div>
                  <div className="text-xs text-gray-500">Appearances</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{profile.goals || 0}</div>
                  <div className="text-xs text-gray-500">Goals</div>
                </div>
              </div>

              {user?.role === USER_ROLES.SCOUT && (
                <div className="mt-6 space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleScoutInterest('added_to_watchlist')}
                    disabled={scoutInterestMutation.isPending}
                  >
                    <FaUserPlus className="mr-2" />
                    Add to Watchlist
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleScoutInterest('viewed_profile')}
                    >
                      <FaEye className="mr-2" />
                      Record View
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/messages/${playerId}`}>
                        <FaEnvelope className="mr-2" />
                        Message
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Player Bio */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {profile.bio || "No bio provided."}
              </p>
              
              {profile.achievements && (
                <>
                  <h4 className="font-bold text-gray-900 mt-4 mb-2">Achievements</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.achievements}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Player Stats */}
          {profile.stats && <ProfileStats stats={profile.stats} />}
        </div>

        {/* Videos and Activity */}
        <div className="md:col-span-2 space-y-6">
          {/* Videos */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Highlight Videos</h3>
                {videos.length > 6 && (
                  <Button variant="link" asChild>
                    <Link href={`/videos?player=${playerId}`}>View All</Link>
                  </Button>
                )}
              </div>
              
              <HighlightsList userId={playerId} limit={6} />
            </CardContent>
          </Card>

          {/* Match Stats */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-6">Match Statistics</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* In a real app, these would come from the API */}
                    <tr>
                      <td className="px-4 py-3">
                        <span className="font-medium">vs. Manchester City U23</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">June 15, 2023</td>
                      <td className="px-4 py-3 text-center">90</td>
                      <td className="px-4 py-3 text-center">1</td>
                      <td className="px-4 py-3 text-center">0</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="font-medium">8.5</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <span className="font-medium">vs. Arsenal U23</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">June 8, 2023</td>
                      <td className="px-4 py-3 text-center">82</td>
                      <td className="px-4 py-3 text-center">0</td>
                      <td className="px-4 py-3 text-center">2</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="font-medium">7.8</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <span className="font-medium">vs. Chelsea U23</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">June 1, 2023</td>
                      <td className="px-4 py-3 text-center">90</td>
                      <td className="px-4 py-3 text-center">2</td>
                      <td className="px-4 py-3 text-center">1</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="font-medium">9.2</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Scout Reports */}
          {user?.role === USER_ROLES.SCOUT && (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-6">Your Notes</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <textarea 
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Add your private scouting notes here about this player..."
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <Button>Save Notes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
