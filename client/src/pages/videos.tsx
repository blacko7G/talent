import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UploadHighlight } from "@/components/upload-highlight";
import { VideoPlayer } from "@/components/video-player";
import { VideoGrid } from "@/components/video-grid";
import { Link } from "wouter";

interface Video {
  id: string;
  title: string;
  description: string;
  userId: string;
  url: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface VideoResponse {
  video: Video;
}

interface UserResponse {
  user: User;
}

export default function Videos() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("newest");
  const [, params] = useRoute("/videos/:id");
  const [isUploadRoute] = useRoute("/videos/upload");
  const videoId = params?.id;
  
  // Fetch specific video if ID is provided
  const { data: videoData, isLoading: isVideoLoading } = useQuery<VideoResponse>({
    queryKey: [`/api/videos/${videoId}`],
    enabled: !!videoId,
  });
  
  // Fetch user who uploaded the video (if viewing a specific video)
  const { data: userData, isLoading: isUserLoading } = useQuery<UserResponse>({
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
  if (videoId) {
    if (isVideoLoading || isUserLoading) {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DashboardLayout>
      );
    }
    
    if (!videoData?.video) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
            <p className="mt-2 text-gray-600">The video you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" asChild>
              <Link href="/videos">Back to Videos</Link>
            </Button>
          </div>
        </DashboardLayout>
      );
    }
    
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{videoData.video.title}</h1>
            <Button variant="outline" asChild>
              <Link href="/videos">Back to Videos</Link>
            </Button>
          </div>
          
          <VideoPlayer video={videoData.video} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{videoData.video.description}</p>
              </Card>
            </div>
            
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Uploaded by</h2>
                {userData?.user && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={userData.user.avatar || "/default-avatar.png"}
                      alt={userData.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{userData.user.name}</p>
                      <p className="text-sm text-gray-500">{userData.user.email}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show video list/grid view
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <Button asChild>
            <Link href="/videos/upload">Upload Video</Link>
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search videos..."
            className="max-w-sm"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <VideoGrid />
      </div>
    </DashboardLayout>
  );
}
