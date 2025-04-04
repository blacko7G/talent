import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FaVideo, FaUpload, FaImage } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

// Video form schema with validation
const videoFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration is required").optional(),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

export default function UploadHighlight() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: undefined,
    },
  });

  // Video upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Simulate upload progress
      const mockUpload = () => {
        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };

      // Make the actual API request
      const simulateProgress = mockUpload();
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload video');
      }

      // Ensure the progress animation completes
      await simulateProgress;
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/user/${user?.id}`] });
      toast({
        title: "Upload successful",
        description: "Your highlight video has been uploaded",
      });
      setLocation('/videos');
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your video",
        variant: "destructive",
      });
    },
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      // Extract video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        form.setValue('duration', Math.floor(video.duration));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: VideoFormValues) => {
    if (!videoFile) {
      toast({
        title: "Video required",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('title', data.title);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.duration) {
      formData.append('duration', data.duration.toString());
    }
    
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    try {
      await uploadMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Highlight Video</CardTitle>
        <CardDescription>
          Share your best football moments to showcase your skills to scouts and academies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Video Upload Section */}
            <div className="mb-6">
              <FormLabel className="mb-2 block">Video File</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {videoFile ? (
                  <div className="space-y-2">
                    <FaVideo className="mx-auto text-2xl text-primary" />
                    <p className="text-sm font-medium">{videoFile.name}</p>
                    <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVideoFile(null)}
                    >
                      Change Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FaUpload className="mx-auto text-4xl text-gray-400" />
                    <p className="text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">MP4, MOV or AVI (max. 100MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      Select Video
                    </Button>
                  </div>
                )}
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </div>
            </div>

            {/* Thumbnail Upload (Optional) */}
            <div className="mb-6">
              <FormLabel className="mb-2 block">Thumbnail (Optional)</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {thumbnailFile ? (
                  <div className="space-y-2">
                    <div className="w-full h-32 max-w-xs mx-auto relative">
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail"
                        className="h-full mx-auto object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium">{thumbnailFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setThumbnailFile(null)}
                    >
                      Change Thumbnail
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FaImage className="mx-auto text-4xl text-gray-400" />
                    <p className="text-gray-500">Upload a thumbnail image</p>
                    <p className="text-xs text-gray-400">JPG, PNG or WEBP (max. 5MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>

            {/* Video Details */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter a descriptive title for your video" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add details about your highlight video"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setLocation('/videos')}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={uploading || uploadMutation.isPending}
        >
          {uploading || uploadMutation.isPending ? "Uploading..." : "Upload Video"}
        </Button>
      </CardFooter>
    </Card>
  );
}
