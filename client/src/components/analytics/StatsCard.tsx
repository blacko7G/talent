import { Card, CardContent } from "@/components/ui/card";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold">{value}</div>
          <div className={`ml-2 text-sm flex items-center ${
            trend === "up" 
              ? "text-green-600" 
              : trend === "down" 
                ? "text-red-600" 
                : "text-gray-500"
          }`}>
            {trend === "up" && <FaArrowUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <FaArrowDown className="mr-1 h-3 w-3" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
