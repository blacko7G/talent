import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { USER_ROLES, PlayerStats } from "@shared/schema";
import { FaUpload, FaUser } from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // For player-specific stats
  const playerStatsSchema = z.object({
    pace: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
    shooting: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
    passing: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
    dribbling: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
    defense: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
    physical: z.preprocess(
      (val) => parseInt(String(val), 10) || 0,
      z.number().min(0).max(100)
    ),
  });

  // Fetch the appropriate profile based on user role
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [`/api/profiles/${user?.role}/${user?.id}`],
    enabled: !!user?.id,
  });

  // Define form schemas based on user role
  let formSchema;
  if (user?.role === USER_ROLES.PLAYER) {
    formSchema = z.object({
      position: z.string().min(1, "Position is required"),
      age: z.preprocess(
        (val) => parseInt(String(val), 10) || 0,
        z.number().min(10).max(50)
      ),
      location: z.string().min(1, "Location is required"),
      bio: z.string().optional(),
      achievements: z.string().optional(),
      stats: playerStatsSchema,
    });
  } else if (user?.role === USER_ROLES.SCOUT) {
    formSchema = z.object({
      organization: z.string().min(1, "Organization is required"),
      position: z.string().min(1, "Position is required"),
      bio: z.string().optional(),
      yearsOfExperience: z.preprocess(
        (val) => parseInt(String(val), 10) || 0,
        z.number().min(0)
      ),
    });
  } else if (user?.role === USER_ROLES.ACADEMY) {
    formSchema = z.object({
      name: z.string().min(1, "Academy name is required"),
      location: z.string().min(1, "Location is required"),
      description: z.string().optional(),
      foundedYear: z.preprocess(
        (val) => parseInt(String(val), 10) || 0,
        z.number().min(1800).max(new Date().getFullYear())
      ),
      website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    });
  } else {
    formSchema = z.object({});
  }

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profileData?.profile) {
      form.reset(getDefaultValues(profileData.profile));
    }
  }, [profileData]);

  function getDefaultValues(profile?: any): FormValues {
    if (user?.role === USER_ROLES.PLAYER) {
      return {
        position: profile?.position || "",
        age: profile?.age || 18,
        location: profile?.location || "",
        bio: profile?.bio || "",
        achievements: profile?.achievements || "",
        stats: {
          pace: profile?.stats?.pace || 50,
          shooting: profile?.stats?.shooting || 50,
          passing: profile?.stats?.passing || 50,
          dribbling: profile?.stats?.dribbling || 50,
          defense: profile?.stats?.defense || 50,
          physical: profile?.stats?.physical || 50,
        },
      } as FormValues;
    } else if (user?.role === USER_ROLES.SCOUT) {
      return {
        organization: profile?.organization || "",
        position: profile?.position || "",
        bio: profile?.bio || "",
        yearsOfExperience: profile?.yearsOfExperience || 0,
      } as FormValues;
    } else if (user?.role === USER_ROLES.ACADEMY) {
      return {
        name: profile?.name || "",
        location: profile?.location || "",
        description: profile?.description || "",
        foundedYear: profile?.foundedYear || new Date().getFullYear() - 10,
        website: profile?.website || "",
      } as FormValues;
    }
    
    return {} as FormValues;
  }

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const endpoint = `/api/profiles/${user?.role}`;
      const res = await apiRequest("PUT", endpoint, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${user?.role}/${user?.id}`] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    },
  });

  // Upload profile image mutation
  const uploadProfileImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/users/profile-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated",
      });
      setProfileImage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your image",
        variant: "destructive",
      });
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      await uploadProfileImageMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    await updateProfileMutation.mutateAsync(data);
    
    // Upload profile image if there is one
    if (profileImage) {
      await uploadProfileImage();
    }
  };

  // Render loading state
  if (isProfileLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            {user?.role === USER_ROLES.PLAYER && (
              <TabsTrigger value="stats">Player Statistics</TabsTrigger>
            )}
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                  <CardDescription>Upload a photo for your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                      {profileImage ? (
                        <img 
                          src={URL.createObjectURL(profileImage)} 
                          alt="Profile preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={`${user.firstName} ${user.lastName}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl font-bold text-gray-500">
                          <FaUser />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('profile-image')?.click()}
                      >
                        <FaUpload className="mr-2" /> Select Image
                      </Button>
                      
                      {profileImage && (
                        <Button
                          type="button"
                          className="w-full"
                          onClick={uploadProfileImage}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      )}
                      
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Render form fields based on user role */}
                      {user?.role === USER_ROLES.PLAYER && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="position"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Forward, Midfielder" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="age"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Age</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. London, UK" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell scouts and academies about yourself"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="achievements"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Achievements</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List your football achievements"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      {user?.role === USER_ROLES.SCOUT && (
                        <>
                          <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Arsenal FC" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Talent Scout" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="yearsOfExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell players about yourself and what you're looking for"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      {user?.role === USER_ROLES.ACADEMY && (
                        <>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Academy Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Arsenal Academy" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. London, UK" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="foundedYear"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Founded Year</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://www.example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell players about your academy"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {user?.role === USER_ROLES.PLAYER && (
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Player Statistics</CardTitle>
                  <CardDescription>Update your player statistics to showcase your abilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="stats.pace"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Pace</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stats.shooting"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Shooting</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stats.passing"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Passing</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stats.dribbling"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Dribbling</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stats.defense"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Defense</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stats.physical"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between mb-1">
                                <FormLabel>Physical</FormLabel>
                                <span className="text-sm font-medium">{field.value}</span>
                              </div>
                              <FormControl>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                      <Input value={user?.firstName} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                      <Input value={user?.lastName} disabled />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                    <Input value={user?.email} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" disabled>Change Password</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Account Actions</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" disabled>Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
