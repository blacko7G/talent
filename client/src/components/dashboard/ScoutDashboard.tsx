import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FaCog, FaUserPlus, FaSearch, FaCalendarAlt, FaCommentAlt, FaStar, FaChartLine } from "react-icons/fa";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ScoutDashboard() {
  const { user } = useAuth();

  // Fetch scout profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [`/api/profiles/scout/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch all players
  const { data: playersData, isLoading: isPlayersLoading } = useQuery({
    queryKey: [`/api/profiles/player`],
    enabled: !!user?.id,
  });

  // Fetch scout interests
  const { data: interestsData, isLoading: isInterestsLoading } = useQuery({
    queryKey: [`/api/interests/scout/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch messages
  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    queryKey: [`/api/messages`],
    enabled: !!user?.id,
  });

  const profile = profileData?.profile;
  const players = playersData?.players || [];
  const interests = interestsData?.interests || [];
  const conversations = messagesData?.conversations || [];

  const isLoading = isProfileLoading || isPlayersLoading || isInterestsLoading || isMessagesLoading;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Recent activity section - combine viewed profiles, watched videos, etc.
  const recentActivity = interests.slice(0, 5);

  // Top prospects section
  const topProspects = players
    .filter((player: any) => player.profile?.isEliteProspect)
    .slice(0, 4);

  // Upcoming trials to scout
  const upcomingTrials = [
    {
      id: 1,
      title: "Arsenal Academy Trial",
      organization: "Arsenal FC",
      date: new Date(2023, 6, 15),
      location: "London, UK",
      ageGroup: "U23"
    },
    {
      id: 2,
      title: "Chelsea FC Elite Development",
      organization: "Chelsea FC",
      date: new Date(2023, 7, 3),
      location: "London, UK",
      ageGroup: "U23"
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scout Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <FaCog className="mr-2" />
            Settings
          </Button>
          <Button asChild>
            <Link href="/discover" className="flex items-center">
              <FaSearch className="mr-2" />
              Discover Players
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
                      alt={`${user.firstName} ${user.lastName}`} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl font-bold text-gray-500">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-16 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-gray-500">
                  {profile?.organization} • {profile?.position}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  {profile?.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profile?.yearsOfExperience}+ Years Experience
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-bold text-2xl stat-value">{interests.length || 0}</div>
                  <div className="text-xs text-gray-500">Players Scouted</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{topProspects.length || 0}</div>
                  <div className="text-xs text-gray-500">Elite Prospects</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{conversations.length || 0}</div>
                  <div className="text-xs text-gray-500">Conversations</div>
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
                  <Link href="/discover">
                    <FaSearch className="mr-2" /> Discover Players
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/trials">
                    <FaCalendarAlt className="mr-2" /> Upcoming Trials
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/messages">
                    <FaCommentAlt className="mr-2" /> Messages
                    {conversations.filter((c: any) => c.unreadCount > 0).length > 0 && (
                      <Badge className="ml-auto bg-accent">{conversations.filter((c: any) => c.unreadCount > 0).length}</Badge>
                    )}
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

          {/* Upcoming Trials */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-6">Upcoming Trials</h3>
              <div className="space-y-4">
                {upcomingTrials.map((trial) => (
                  <div key={trial.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaCalendarAlt className="text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-sm">{trial.title}</h4>
                          <p className="text-xs text-gray-500">{trial.location} • {trial.ageGroup}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-accent">
                        {format(trial.date, 'MMM dd')}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="link" asChild className="w-full">
                  <Link href="/trials">View All Trials</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Columns - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player Search Summary */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Player Discovery</h3>
                <Button asChild>
                  <Link href="/discover">Find More Players</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="form-input block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Search for players by name, position, location..."
                  />
                </div>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="top-prospects">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="top-prospects">Top Prospects</TabsTrigger>
                    <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
                    <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
                  </TabsList>
                  <TabsContent value="top-prospects" className="mt-4">
                    {topProspects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topProspects.map((player: any) => (
                          <div key={player.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {player.profileImage ? (
                                  <img src={player.profileImage} alt={player.firstName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="font-bold text-gray-500">{player.firstName?.[0]}{player.lastName?.[0]}</div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{player.firstName} {player.lastName}</h4>
                                  {player.profile?.isVerified && (
                                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">Verified</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{player.profile?.position} • {player.profile?.age} yrs • {player.profile?.location}</p>
                                <div className="mt-2 flex justify-between">
                                  <span className="text-sm font-medium">Rating: {player.profile?.overallRating || 'N/A'}</span>
                                  <Link href={`/discover/${player.id}`} className="text-primary text-sm font-medium">View Profile</Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No top prospects available</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="recently-viewed" className="mt-4">
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity: any) => (
                          <div key={activity.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {activity.player?.profileImage ? (
                                  <img src={activity.player.profileImage} alt={activity.player.firstName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="font-bold text-gray-500">{activity.player?.firstName?.[0]}{activity.player?.lastName?.[0]}</div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{activity.player?.firstName} {activity.player?.lastName}</h4>
                                  <span className="text-xs text-gray-500">{format(new Date(activity.createdAt), 'MMM dd')}</span>
                                </div>
                                <p className="text-sm text-gray-500">{activity.player?.profile?.position} • {activity.player?.profile?.age} yrs</p>
                                <div className="mt-1 text-sm">
                                  {activity.type === 'viewed_profile' && 'You viewed this profile'}
                                  {activity.type === 'watched_video' && `You watched "${activity.resource?.title || 'a video'}"`}
                                  {activity.type === 'added_to_watchlist' && 'You added to your watchlist'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No recently viewed players</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="watchlist" className="mt-4">
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your watchlist is empty</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/discover">Discover Players</Link>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Recent Messages</h3>
                <Button variant="outline" asChild>
                  <Link href="/messages">View All</Link>
                </Button>
              </div>

              {conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.slice(0, 3).map((conversation: any) => (
                    <div key={conversation.partner.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                          {conversation.partner.profileImage ? (
                            <img src={conversation.partner.profileImage} alt={conversation.partner.firstName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="font-bold text-gray-500">{conversation.partner.firstName?.[0]}{conversation.partner.lastName?.[0]}</div>
                          )}
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white rounded-full flex items-center justify-center text-xs">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{conversation.partner.firstName} {conversation.partner.lastName}</h4>
                            <span className="text-xs text-gray-500">{format(new Date(conversation.lastMessage.createdAt), 'MMM dd')}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">{conversation.lastMessage.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCommentAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500">No messages yet</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/discover">Start Scouting</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Scouting Performance</h3>
                <Button variant="outline" asChild>
                  <Link href="/analytics">Full Analytics</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{interests.length}</div>
                  <div className="text-sm text-gray-500">Players Scouted</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Successful Placements</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-gray-500">Trial Recommendations</div>
                </div>
              </div>

              <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance analytics visualization</p>
                  <p className="text-xs text-gray-400 mt-1">Track your scouting activity over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
