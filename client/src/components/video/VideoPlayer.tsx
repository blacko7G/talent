import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import { FaPlay, FaPause, FaExpand, FaVolumeMute, FaVolumeUp, FaClock, FaHeart } from "react-icons/fa";

interface VideoPlayerProps {
  video: any;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };

    const handleRateChange = () => {
      setPlaybackRate(videoElement.playbackRate);
    };

    const handleFullscreenChange = () => {
      setIsFullScreen(document.fullscreenElement === videoElement);
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("durationchange", handleDurationChange);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("volumechange", handleVolumeChange);
    videoElement.addEventListener("ratechange", handleRateChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("durationchange", handleDurationChange);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("volumechange", handleVolumeChange);
      videoElement.removeEventListener("ratechange", handleRateChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Like video mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/videos/${video.id}/like`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${video.id}`] });
      toast({
        title: "Video liked",
        description: "You've successfully liked this video",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Action failed",
        description: error.message || "There was an error liking this video",
        variant: "destructive",
      });
    },
  });

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value[0];
    if (value[0] === 0) {
      videoRef.current.muted = true;
    } else if (isMuted) {
      videoRef.current.muted = false;
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value[0];
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <Card className="overflow-hidden shadow-card">
      <div className="relative">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          className="w-full bg-black"
          controls={false}
          preload="metadata"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <FaPause className="h-6 w-6 text-black" />
            ) : (
              <FaPlay className="h-6 w-6 text-black" />
            )}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 min-w-[70px] text-right">
              {formatTime(currentTime)} / {formatTime(video.duration || duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8"
                onClick={togglePlay}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>

              <div className="flex items-center space-x-2 w-28">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-16"
                />
              </div>

              <div className="flex items-center space-x-1">
                <FaClock className="h-3.5 w-3.5 text-gray-500" />
                <select
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                  className="text-xs bg-transparent text-gray-700 font-medium"
                >
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-8 space-x-1 flex items-center"
                onClick={handleLike}
                disabled={likeMutation.isPending}
              >
                <FaHeart className={`${likeMutation.isPending ? "animate-pulse" : ""}`} />
                <span>{video.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={toggleFullScreen}
              >
                <FaExpand />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
