import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PerformanceChart from "@/components/analytics/PerformanceChart";
import StatsCard from "@/components/analytics/StatsCard";
import { useAuth } from "@/lib/authContext";
import { USER_ROLES } from "@shared/schema";
import { useState } from "react";
import { FaChartLine, FaCalendarAlt, FaUsers, FaEye, FaVideo, FaCheckCircle } from "react-icons/fa";

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30days");
  
  // Helper to render role-specific analytics
  const renderRoleSpecificAnalytics = () => {
    switch (user?.role) {
      case USER_ROLES.PLAYER:
        return renderPlayerAnalytics();
      case USER_ROLES.SCOUT:
        return renderScoutAnalytics();
      case USER_ROLES.ACADEMY:
        return renderAcademyAnalytics();
      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">No analytics available</p>
            </CardContent>
          </Card>
        );
    }
  };
  
  // Player-specific analytics
  const renderPlayerAnalytics = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard 
            title="Profile Views" 
            value="245" 
            change="+12%" 
            trend="up"
            icon={<FaEye className="h-5 w-5" />}
          />
          <StatsCard 
            title="Video Views" 
            value="832" 
            change="+28%" 
            trend="up"
            icon={<FaVideo className="h-5 w-5" />}
          />
          <StatsCard 
            title="Scout Interests" 
            value="8" 
            change="+3" 
            trend="up"
            icon={<FaUsers className="h-5 w-5" />}
          />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile View Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart
              data={[
                { name: 'Jan', value: 45 },
                { name: 'Feb', value: 52 },
                { name: 'Mar', value: 48 },
                { name: 'Apr', value: 61 },
                { name: 'May', value: 95 },
                { name: 'Jun', value: 135 },
              ]}
              dataKey="value"
              height={300}
              color="#0F4C81"
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Goal vs Manchester City U23</p>
                    <p className="text-sm text-gray-500">1:24 min</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">245</p>
                    <p className="text-sm text-gray-500">views</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Assist and Skill Moves Compilation</p>
                    <p className="text-sm text-gray-500">3:45 min</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">587</p>
                    <p className="text-sm text-gray-500">views</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scout Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Arsenal FC</p>
                    <p className="text-sm text-gray-500">3 scouts viewed your profile</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">Last week</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Chelsea FC</p>
                    <p className="text-sm text-gray-500">1 scout viewed your profile</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Brighton FC</p>
                    <p className="text-sm text-gray-500">Added you to watchlist</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">Today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  // Scout-specific analytics
  const renderScoutAnalytics = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard 
            title="Players Scouted" 
            value="32" 
            change="+8" 
            trend="up"
            icon={<FaUsers className="h-5 w-5" />}
          />
          <StatsCard 
            title="Videos Watched" 
            value="87" 
            change="+23" 
            trend="up"
            icon={<FaVideo className="h-5 w-5" />}
          />
          <StatsCard 
            title="Successful Placements" 
            value="5" 
            change="+2" 
            trend="up"
            icon={<FaCheckCircle className="h-5 w-5" />}
          />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Scouting Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart
              data={[
                { name: 'Jan', value: 5 },
                { name: 'Feb', value: 8 },
                { name: 'Mar', value: 12 },
                { name: 'Apr', value: 9 },
                { name: 'May', value: 15 },
                { name: 'Jun', value: 18 },
              ]}
              dataKey="value"
              height={300}
              color="#0F4C81"
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Scouted Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <span className="font-bold text-gray-600">DJ</span>
                    </div>
                    <div>
                      <p className="font-medium">David Johnson</p>
                      <p className="text-sm text-gray-500">Forward • 21 years</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">View Profile</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                      <span className="font-bold text-gray-600">MS</span>
                    </div>
                    <div>
                      <p className="font-medium">Michael Smith</p>
                      <p className="text-sm text-gray-500">Midfielder • 20 years</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">View Profile</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Arsenal Academy Trial</p>
                    <p className="text-sm text-gray-500">London, UK • July 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">5 days left</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Chelsea FC Elite Development</p>
                    <p className="text-sm text-gray-500">London, UK • August 3, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary">3 weeks left</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  // Academy-specific analytics
  const renderAcademyAnalytics = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard 
            title="Active Trials" 
            value="3" 
            change="+1" 
            trend="up"
            icon={<FaCalendarAlt className="h-5 w-5" />}
          />
          <StatsCard 
            title="Applications" 
            value="28" 
            change="+12" 
            trend="up"
            icon={<FaUsers className="h-5 w-5" />}
          />
          <StatsCard 
            title="Accepted Players" 
            value="8" 
            change="+3" 
            trend="up"
            icon={<FaCheckCircle className="h-5 w-5" />}
          />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Applications Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart
              data={[
                { name: 'Jan', value: 12 },
                { name: 'Feb', value: 19 },
                { name: 'Mar', value: 15 },
                { name: 'Apr', value: 22 },
                { name: 'May', value: 28 },
                { name: 'Jun', value: 35 },
              ]}
              dataKey="value"
              height={300}
              color="#0F4C81"
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">U23 Forward Position</p>
                    <p className="text-sm text-gray-500">July 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">15</p>
                    <p className="text-sm text-gray-500">applications</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">U23 Attacking Midfielder</p>
                    <p className="text-sm text-gray-500">August 3, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">12</p>
                    <p className="text-sm text-gray-500">applications</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">U18 Goalkeeper</p>
                    <p className="text-sm text-gray-500">June 10, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">8</p>
                    <p className="text-sm text-gray-500">applications</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold">28</p>
                      <p className="text-sm text-gray-500">Total Applications</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* Pending - 60% */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#FFC107" 
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="100.48"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Accepted - 25% */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#4CAF50" 
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="188.4"
                      strokeDashoffset="100.48"
                      transform="rotate(150 50 50)"
                    />
                    {/* Rejected - 15% */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#F44336" 
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="213.52"
                      transform="rotate(240 50 50)"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div>
                    <p className="text-xs">Pending</p>
                    <p className="font-medium">60%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <div>
                    <p className="text-xs">Accepted</p>
                    <p className="font-medium">25%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <div>
                    <p className="text-xs">Rejected</p>
                    <p className="font-medium">15%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your performance and activity</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <SelectValue placeholder="Select time range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {renderRoleSpecificAnalytics()}
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardContent className="p-12 text-center">
              <FaChartLine className="mx-auto text-4xl text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">Engagement Analytics</h3>
              <p className="text-gray-500 text-sm mt-1">
                Detailed engagement analytics are coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardContent className="p-12 text-center">
              <FaChartLine className="mx-auto text-4xl text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">Performance Analytics</h3>
              <p className="text-gray-500 text-sm mt-1">
                Detailed performance analytics are coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
