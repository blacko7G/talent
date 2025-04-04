import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FaPlus, FaSort } from "react-icons/fa";
import { Link, useRoute } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HighlightsList from "@/components/video/HighlightsList";
import UploadHighlight from "@/components/profile/UploadHighlight";
import VideoPlayer from "@/components/video/VideoPlayer";

export default function Videos({ videoId }: { videoId?: string }) {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("newest");
  const [isVideoRoute] = useRoute("/videos/:id");
  const [isUploadRoute] = useRoute("/videos/upload");
  
  // Fetch specific video if ID is provided
  const { data: videoData, isLoading: isVideoLoading } = useQuery({
    queryKey: [`/api/videos/${videoId}`],
    enabled: !!videoId,
  });
  
  // Fetch user who uploaded the video (if viewing a specific video)
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${videoData?.video?.userId}`],
    enabled: !!videoData?.video?.userId,
  });
  
  // If on the upload route, show the upload component
  if (isUploadRoute) {
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Upload Highlight</h1>
          <Button variant="outline" asChild>
            <Link href="/videos">Cancel</Link>
          </Button>
        </div>
        
        <UploadHighlight />
      </DashboardLayout>
    );
  }
  
  // If viewing a specific video
  if (isVideoRoute && videoId) {
    const video = videoData?.video;
    const videoOwner = userData?.user;
    
    const isLoading = isVideoLoading || isUserLoading;
    
    if (isLoading) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading video...</p>
          </div>
        </DashboardLayout>
      );
    }
    
    if (!video) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Video Not Found</h2>
            <p className="text-gray-600 mb-4">The video you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/videos">Back to Videos</Link>
            </Button>
          </div>
        </DashboardLayout>
      );
    }
    
    return (
      <DashboardLayout>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="outline" asChild className="mb-2">
              <Link href="/videos">&larr; Back to Videos</Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer video={video} />
            
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700">{video.description || "No description provided."}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold mb-4">Uploaded by</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                  {videoOwner?.profileImage ? (
                    <img 
                      src={videoOwner.profileImage} 
                      alt={`${videoOwner.firstName} ${videoOwner.lastName}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="font-bold text-gray-500">
                      {videoOwner?.firstName?.[0]}{videoOwner?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{videoOwner?.firstName} {videoOwner?.lastName}</p>
                  <Button variant="link" className="p-0 h-auto text-primary" asChild>
                    <Link href={`/discover/${videoOwner?.id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold mb-4">Video Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span>{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span>{video.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Likes:</span>
                  <span>{video.likes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold mb-4">More from {videoOwner?.firstName}</h2>
              <div className="space-y-4">
                <HighlightsList userId={video.userId} limit={2} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Default videos list view
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Highlight Videos</h1>
          <p className="text-gray-600">Browse and discover football talent</p>
        </div>
        
        {user?.role === "player" && (
          <Button asChild>
            <Link href="/videos/upload" className="flex items-center">
              <FaPlus className="mr-2" />
              Upload Highlight
            </Link>
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="my">My Videos</TabsTrigger>
            <TabsTrigger value="watched">Recently Watched</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <FaSort className="mr-2 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most_viewed">Most Viewed</SelectItem>
              <SelectItem value="most_liked">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <TabsContent value="all" className="mt-0">
        <HighlightsList />
      </TabsContent>
      
      <TabsContent value="my" className="mt-0">
        <HighlightsList userId={user?.id} />
      </TabsContent>
      
      <TabsContent value="watched" className="mt-0">
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <h3 className="font-medium text-gray-700">No recently watched videos</h3>
          <p className="text-gray-500 text-sm mt-1">
            Videos you watch will appear here
          </p>
        </div>
      </TabsContent>
    </DashboardLayout>
  );
}
