import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
}

interface VideosResponse {
  videos: Video[];
}

export function VideoGrid() {
  const { data, isLoading } = useQuery<VideosResponse>({
    queryKey: ["/api/videos"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!data?.videos?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading your first video.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.videos.map((video: Video) => (
        <Link key={video.id} href={`/videos/${video.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={video.thumbnail || "/placeholder-video.jpg"}
                alt={video.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{video.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 