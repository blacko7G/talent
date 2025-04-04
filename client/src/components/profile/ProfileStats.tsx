import { Card, CardContent } from "@/components/ui/card";
import { PlayerStats } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProfileStatsProps {
  stats: PlayerStats;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  // Function to render a stat bar
  const renderStatBar = (label: string, value: number = 0) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Key Statistics</h3>
          <Button variant="link" className="p-0" asChild>
            <Link href="/profile">View All</Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {renderStatBar("Pace", stats.pace)}
          {renderStatBar("Shooting", stats.shooting)}
          {renderStatBar("Passing", stats.passing)}
          {renderStatBar("Dribbling", stats.dribbling)}
          {renderStatBar("Defense", stats.defense)}
          {renderStatBar("Physical", stats.physical)}
          
          {/* Additional stats can be rendered dynamically */}
          {Object.entries(stats)
            .filter(([key]) => !["pace", "shooting", "passing", "dribbling", "defense", "physical"].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                {renderStatBar(
                  key.charAt(0).toUpperCase() + key.slice(1), 
                  typeof value === 'number' ? value : 0
                )}
              </div>
            ))
          }
        </div>
      </CardContent>
    </Card>
  );
}
