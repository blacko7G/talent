import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FaCog, FaPlus, FaUsers, FaCalendarAlt, FaClipboardList, FaChartLine } from "react-icons/fa";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AcademyDashboard() {
  const { user } = useAuth();

  // Fetch academy profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [`/api/profiles/academy/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch created trials
  const { data: trialsData, isLoading: isTrialsLoading } = useQuery({
    queryKey: [`/api/trials/creator/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch messages
  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    queryKey: [`/api/messages`],
    enabled: !!user?.id,
  });

  const profile = profileData?.profile;
  const trials = trialsData?.trials || [];
  const conversations = messagesData?.conversations || [];

  const isLoading = isProfileLoading || isTrialsLoading || isMessagesLoading;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Mock application data (in real app, this would come from the API)
  const applications = [
    {
      id: 1,
      playerName: "David Johnson",
      position: "Forward",
      age: 21,
      date: new Date(),
      trialId: 1,
      status: "pending"
    },
    {
      id: 2,
      playerName: "Michael Smith",
      position: "Midfielder",
      age: 20,
      date: new Date(),
      trialId: 1,
      status: "accepted"
    },
    {
      id: 3,
      playerName: "James Wilson",
      position: "Defender",
      age: 22,
      date: new Date(),
      trialId: 2,
      status: "rejected"
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Academy Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <FaCog className="mr-2" />
            Settings
          </Button>
          <Button asChild>
            <Link href="/trials/create" className="flex items-center">
              <FaPlus className="mr-2" />
              Post New Trial
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden shadow-card">
            <div className="bg-primary h-24 relative"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full border-4 border-white absolute -mt-12 overflow-hidden bg-gray-200">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={profile?.name || `${user.firstName} ${user.lastName}`} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-500">
                      {profile?.name?.[0] || user?.firstName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-16 text-center">
                <h2 className="text-xl font-bold text-gray-900">{profile?.name || `${user?.firstName} ${user?.lastName}`}</h2>
                <p className="text-sm text-gray-500">
                  {profile?.location}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  {profile?.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Est. {profile?.foundedYear}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-bold text-2xl stat-value">{trials.length || 0}</div>
                  <div className="text-xs text-gray-500">Active Trials</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{applications.length || 0}</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{applications.filter(app => app.status === 'accepted').length || 0}</div>
                  <div className="text-xs text-gray-500">Accepted</div>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/trials/create">
                    <FaPlus className="mr-2" /> Post New Trial
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/trials">
                    <FaCalendarAlt className="mr-2" /> Manage Trials
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/applications">
                    <FaClipboardList className="mr-2" /> Review Applications
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/analytics">
                    <FaChartLine className="mr-2" /> Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Academy Details */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Academy Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Location:</dt>
                  <dd className="text-sm font-medium">{profile?.location || "Not specified"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Founded:</dt>
                  <dd className="text-sm font-medium">{profile?.foundedYear || "Not specified"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Website:</dt>
                  <dd className="text-sm font-medium">
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit Website
                      </a>
                    ) : (
                      "Not specified"
                    )}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-sm text-gray-600">
                  {profile?.description || "No description provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trial Management */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Trial Management</h3>
                <Button asChild>
                  <Link href="/trials/create">Post New Trial</Link>
                </Button>
              </div>

              <Tabs defaultValue="active">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active Trials</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Trials</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="mt-4">
                  {trials.length > 0 ? (
                    <div className="space-y-4">
                      {trials.map((trial: any) => (
                        <div key={trial.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{trial.title}</h4>
                              <p className="text-sm text-gray-500">{trial.position} • {trial.ageGroup} • {trial.location}</p>
                              <p className="text-sm mt-1">
                                <span className="text-gray-600">Date: </span>
                                <span className="font-medium">{format(new Date(trial.date), 'MMMM dd, yyyy')}</span>
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className="mb-2">{applications.filter(app => app.trialId === trial.id).length} Applications</Badge>
                              <Link href={`/trials/${trial.id}`} className="text-primary text-sm font-medium">
                                Manage
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-700">No active trials</h4>
                      <p className="text-gray-500 text-sm mt-1 mb-4">Post your first trial to start receiving applications</p>
                      <Button asChild>
                        <Link href="/trials/create">Post New Trial</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="upcoming" className="mt-4">
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming trials scheduled</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link href="/trials/create">Schedule Trial</Link>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="past" className="mt-4">
                  <div className="text-center py-8">
                    <p className="text-gray-500">No past trials found</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Recent Applications</h3>
                <Button variant="outline" asChild>
                  <Link href="/applications">View All</Link>
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-2">Player</th>
                        <th className="px-4 py-2">Position</th>
                        <th className="px-4 py-2">Age</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{app.playerName}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">{app.position}</td>
                          <td className="px-4 py-3 text-sm">{app.age}</td>
                          <td className="px-4 py-3 text-sm">{format(app.date, 'MMM dd, yyyy')}</td>
                          <td className="px-4 py-3">
                            <Badge className={`
                              ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                              ${app.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                              ${app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                            `}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Link href={`/applications/${app.id}`} className="text-primary hover:underline">
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <FaUsers className="mx-auto text-4xl text-gray-400 mb-2" />
                  <h4 className="font-medium text-gray-700">No applications yet</h4>
                  <p className="text-gray-500 text-sm mt-1">Applications will appear here once players apply to your trials</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Analytics Overview</h3>
                <Button variant="outline" asChild>
                  <Link href="/analytics">Full Analytics</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{trials.length}</div>
                  <div className="text-sm text-gray-500">Total Trials</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{applications.length}</div>
                  <div className="text-sm text-gray-500">Total Applications</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {applications.length > 0 
                      ? Math.round((applications.filter(app => app.status === 'accepted').length / applications.length) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Acceptance Rate</div>
                </div>
              </div>

              <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Analytics visualization</p>
                  <p className="text-xs text-gray-400 mt-1">Track applications and trial performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
