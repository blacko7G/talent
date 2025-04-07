interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
  };
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <video
        src={video.url}
        poster={video.thumbnail}
        controls
        className="w-full h-full rounded-lg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
} 