import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FaCog, FaPlus, FaEye, FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaPlay } from "react-icons/fa";
import { format } from "date-fns";
import ProfileStats from "@/components/profile/ProfileStats";
import TrialCard from "@/components/trials/TrialCard";

export default function PlayerDashboard() {
  const { user } = useAuth();

  // Fetch player profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [`/api/profiles/player/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch videos
  const { data: videosData, isLoading: isVideosLoading } = useQuery({
    queryKey: [`/api/videos/user/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch scout interests
  const { data: interestsData, isLoading: isInterestsLoading } = useQuery({
    queryKey: [`/api/interests/player/${user?.id}`],
    enabled: !!user?.id,
  });

  // Fetch trials
  const { data: trialsData, isLoading: isTrialsLoading } = useQuery({
    queryKey: [`/api/trials`],
    enabled: !!user?.id,
  });

  // Fetch player's trial applications
  const { data: applicationsData, isLoading: isApplicationsLoading } = useQuery({
    queryKey: [`/api/applications/player`],
    enabled: !!user?.id,
  });

  const profile = profileData?.profile;
  const videos = videosData?.videos || [];
  const interests = interestsData?.interests || [];
  const allTrials = trialsData?.trials || [];
  const applications = applicationsData?.applications || [];

  // Filter upcoming trials (those the player hasn't applied to)
  const appliedTrialIds = applications.map((app: any) => app.trialId);
  const upcomingTrials = allTrials
    .filter((trial: any) => !appliedTrialIds.includes(trial.id))
    .filter((trial: any) => new Date(trial.date) > new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const isLoading = isProfileLoading || isVideosLoading || isInterestsLoading || isTrialsLoading || isApplicationsLoading;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Player Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <FaCog className="mr-2" />
            Settings
          </Button>
          <Button asChild>
            <Link href="/videos/upload" className="flex items-center">
              <FaPlus className="mr-2" />
              Upload Highlights
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
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
                  {profile?.position} • {profile?.age} years • {profile?.location}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  {profile?.isEliteProspect && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Elite Prospect
                    </span>
                  )}
                  {profile?.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-bold text-2xl stat-value">{profile?.overallRating || 0}</div>
                  <div className="text-xs text-gray-500">Overall Rating</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{profile?.appearances || 0}</div>
                  <div className="text-xs text-gray-500">Appearances</div>
                </div>
                <div>
                  <div className="font-bold text-2xl stat-value">{profile?.goals || 0}</div>
                  <div className="text-xs text-gray-500">Goals</div>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          {profile?.stats && <ProfileStats stats={profile.stats} />}

          {/* Upcoming Trials */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-6">Upcoming Trials</h3>
              
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.slice(0, 2).map((app: any) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaCalendarAlt className="text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-sm">{app.trial?.title || "Trial"}</h4>
                            <p className="text-xs text-gray-500">{app.trial?.location || "Location"} • {app.trial?.ageGroup || "Age Group"}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-accent">
                          {app.trial?.date ? format(new Date(app.trial.date), 'MMM dd') : "Soon"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No upcoming trials
                  </div>
                )}
                
                <Button variant="link" asChild className="w-full">
                  <Link href="/trials">View All Trials</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Highlights and Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Latest Highlights */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Latest Highlights</h3>
                <div className="flex space-x-2">
                  <Button variant="link" asChild>
                    <Link href="/videos">View All</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/videos/upload" className="flex items-center">
                      <FaPlus className="mr-2 text-xs" />
                      Add New
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.length > 0 ? (
                  videos.slice(0, 2).map((video: any) => (
                    <Link key={video.id} href={`/videos/${video.id}`}>
                      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 relative">
                          <div className="w-full h-40 bg-gray-200 relative">
                            {video.thumbnail ? (
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="object-cover w-full h-40"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FaVideo className="text-gray-400 text-4xl" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-3">
                                <FaPlay className="text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900">{video.title}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500">
                              {format(new Date(video.createdAt), 'MMM dd')} • {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs flex items-center text-gray-500">
                                <FaEye className="mr-1" /> {video.views}
                              </span>
                              <span className="text-xs flex items-center text-gray-500">
                                <FaHeart className="mr-1" /> {video.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <FaVideo className="mx-auto text-4xl text-gray-400 mb-2" />
                    <h4 className="font-medium text-gray-700">No highlights uploaded yet</h4>
                    <p className="text-gray-500 text-sm mt-1 mb-4">Upload your best football moments to showcase your skills</p>
                    <Button asChild>
                      <Link href="/videos/upload">Upload Highlights</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scout Interest */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-6">Recent Scout Interest</h3>
              
              <div className="space-y-4">
                {interests.length > 0 ? (
                  interests.slice(0, 3).map((interest: any) => (
                    <div key={interest.id} className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {interest.scout?.profileImage ? (
                          <img src={interest.scout.profileImage} alt={interest.scout.firstName} className="object-cover w-full h-full" />
                        ) : (
                          <div className="font-bold text-gray-500">
                            {interest.scout?.firstName?.[0]}{interest.scout?.lastName?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{interest.scout?.firstName} {interest.scout?.lastName}</h4>
                          <span className="text-xs text-gray-500">
                            {format(new Date(interest.createdAt), 'MMM dd')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {interest.scout?.profile?.organization} {interest.scout?.profile?.position}
                        </p>
                        <div className="mt-2 text-sm">
                          {interest.type === 'viewed_profile' && 'Viewed your profile'}
                          {interest.type === 'watched_video' && `Watched ${interest.resource?.title || 'your video'}`}
                          {interest.type === 'added_to_watchlist' && 'Added you to their watchlist'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <FaSearch className="mx-auto text-4xl text-gray-400 mb-2" />
                    <h4 className="font-medium text-gray-700">No scout activity yet</h4>
                    <p className="text-gray-500 text-sm mt-1">
                      Keep updating your profile and videos to attract scout attention
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trial Cards */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Recommended Trials</h3>
                <Button variant="link" asChild>
                  <Link href="/trials">View All</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTrials.length > 0 ? (
                  upcomingTrials.map((trial: any) => (
                    <TrialCard key={trial.id} trial={trial} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                    <h4 className="font-medium text-gray-700">No trials available</h4>
                    <p className="text-gray-500 text-sm mt-1">
                      Check back soon for new trial opportunities
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
