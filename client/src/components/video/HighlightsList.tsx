import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { FaVideo, FaEye, FaHeart, FaPlay } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { formatTime } from "@/lib/utils";

interface HighlightListProps {
  userId?: number;
  limit?: number;
}

export default function HighlightsList({ userId, limit }: HighlightListProps) {
  // Fetch videos
  const { data, isLoading } = useQuery({
    queryKey: userId ? [`/api/videos/user/${userId}`] : ['/api/videos'],
    enabled: userId !== undefined || !userId,
  });

  const videos = data?.videos || [];
  
  // Apply limit if specified
  const displayedVideos = limit ? videos.slice(0, limit) : videos;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading highlights...</p>
      </div>
    );
  }

  if (displayedVideos.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
        <FaVideo className="mx-auto text-4xl text-gray-400 mb-2" />
        <h4 className="font-medium text-gray-700">No highlights found</h4>
        <p className="text-gray-500 text-sm mt-1">
          {userId ? "This player hasn't uploaded any highlights yet." : "No highlights available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedVideos.map((video: any) => (
        <Link key={video.id} href={`/videos/${video.id}`}>
          <Card className="rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
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
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatTime(video.duration)}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 line-clamp-1">{video.title}</h4>
              {video.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {video.createdAt && formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
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
          </Card>
        </Link>
      ))}
    </div>
  );
}
