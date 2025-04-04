import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaUser, FaMapMarkerAlt } from "react-icons/fa";

interface PlayerCardProps {
  player: any;
  onClick: () => void;
}

export default function PlayerCard({ player, onClick }: PlayerCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all hover:border-primary cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-primary to-secondary h-24 relative flex items-center justify-center">
        <div className="h-20 w-20 rounded-full border-4 border-white absolute -bottom-10 bg-white overflow-hidden">
          {player.profileImage ? (
            <img 
              src={player.profileImage} 
              alt={`${player.firstName} ${player.lastName}`} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <FaUser className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="pt-12 p-6">
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg">{player.firstName} {player.lastName}</h3>
          <p className="text-gray-500 text-sm">{player.profile?.position || "Unknown Position"}</p>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-primary">{player.profile?.age || "-"}</div>
            <p className="text-xs text-gray-500">Age</p>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-primary">{player.profile?.overallRating || "-"}</div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-primary">{player.profile?.goals || "-"}</div>
            <p className="text-xs text-gray-500">Goals</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {player.profile?.location && (
            <div className="flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              {player.profile.location}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {player.profile?.isVerified && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Verified
              </Badge>
            )}
            {player.profile?.isEliteProspect && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Elite Prospect
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
