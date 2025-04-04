import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaUserGraduate, FaSearch, FaBuilding, FaVideo, FaClock, FaCalendarAlt, FaChartLine, FaComments } from "react-icons/fa";

export default function Features() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides powerful tools for players, scouts, and academies to connect and discover opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaUserGraduate className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Player Profiles</h3>
              <p className="text-gray-600">
                Create a comprehensive profile showcasing your skills, statistics, and achievements to attract scouts.
              </p>
            </CardContent>
          </Card>
          
          {/* Feature 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaVideo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Video Highlights</h3>
              <p className="text-gray-600">
                Upload and share your best moments on the field to demonstrate your abilities to scouts and academies.
              </p>
            </CardContent>
          </Card>
          
          {/* Feature 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaSearch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Talent Discovery</h3>
              <p className="text-gray-600">
                Advanced search and filtering tools help scouts find the perfect players for their organizations.
              </p>
            </CardContent>
          </Card>
          
          {/* Feature 4 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaCalendarAlt className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trial Management</h3>
              <p className="text-gray-600">
                Academies can post trials and manage applications while players can discover and apply to opportunities.
              </p>
            </CardContent>
          </Card>
          
          {/* Feature 5 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaChartLine className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">
                Track your progress, engagement, and interest from scouts with detailed analytics and reports.
              </p>
            </CardContent>
          </Card>
          
          {/* Feature 6 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FaComments className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Messaging</h3>
              <p className="text-gray-600">
                Connect directly with scouts, players, and academies through our integrated messaging system.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Who Benefits from Our Platform?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <FaUserGraduate className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Players</h4>
              <p className="text-gray-600">
                Showcase your talent, connect with scouts, and find opportunities to advance your football career.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <FaSearch className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Scouts</h4>
              <p className="text-gray-600">
                Discover hidden talent, manage your recruitment pipeline, and make data-driven scouting decisions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <FaBuilding className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Academies</h4>
              <p className="text-gray-600">
                Post trials, review applications, and find the perfect players to join your development programs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
