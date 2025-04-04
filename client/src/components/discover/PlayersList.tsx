import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlayerCard from "@/components/discover/PlayerCard";
import { FaUser, FaSearch } from "react-icons/fa";

interface PlayersListProps {
  players: any[];
  isLoading: boolean;
  viewType: "grid" | "list";
  onSelectPlayer: (playerId: number) => void;
}

export default function PlayersList({ players, isLoading, viewType, onSelectPlayer }: PlayersListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading players...</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
        <FaSearch className="mx-auto text-4xl text-gray-400 mb-2" />
        <h3 className="font-medium text-gray-700">No players found</h3>
        <p className="text-gray-500 text-sm mt-1 mb-4">
          Try adjusting your filters or search criteria
        </p>
        <Button variant="outline">Clear Filters</Button>
      </div>
    );
  }

  // Grid view
  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            onClick={() => onSelectPlayer(player.id)}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4 hover:border-primary transition-colors cursor-pointer" onClick={() => onSelectPlayer(player.id)}>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {player.profileImage ? (
                <img 
                  src={player.profileImage} 
                  alt={`${player.firstName} ${player.lastName}`} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="h-7 w-7 text-gray-400" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-lg">
                    {player.firstName} {player.lastName}
                    {player.profile?.isVerified && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Verified</Badge>
                    )}
                    {player.profile?.isEliteProspect && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">Elite</Badge>
                    )}
                  </h4>
                  <p className="text-gray-500">
                    {player.profile?.position} • {player.profile?.age} years • {player.profile?.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{player.profile?.overallRating || "-"}</div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {player.profile?.stats && (
                  <>
                    <Badge variant="outline" className="bg-gray-50">
                      Pace: {player.profile.stats.pace || "-"}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                      Shooting: {player.profile.stats.shooting || "-"}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                      Passing: {player.profile.stats.passing || "-"}
                    </Badge>
                  </>
                )}
                <Button variant="link" className="p-0 h-auto ml-auto text-primary">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
