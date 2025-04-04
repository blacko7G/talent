import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import { Link } from "wouter";
import { registerSchema, USER_ROLES } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { FaUserGraduate, FaSearch, FaBuilding } from "react-icons/fa";

// Create form schema based on registerSchema
const formSchema = z.object({
  ...registerSchema.shape,
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type RegisterFormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: USER_ROLES.PLAYER,
      termsAccepted: false,
    },
  });

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Add points for length
    if (password.length >= 8) strength += 25;
    
    // Add points for complexity
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    
    // Additional points for mixed character types
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && 
        /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength += 15;
    }
    
    return Math.min(strength, 100);
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Medium";
    return "Strong";
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
    form.setValue("password", password);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      await register(data);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const selectedRole = form.watch("role");

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="bg-primary p-6 text-white">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p>Join our football scouting platform and unlock new opportunities</p>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select your role</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <>
                      <div
                        className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                          field.value === USER_ROLES.PLAYER
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                        }`}
                        onClick={() => form.setValue("role", USER_ROLES.PLAYER)}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                          field.value === USER_ROLES.PLAYER
                            ? "bg-primary bg-opacity-10"
                            : "bg-gray-100"
                        }`}>
                          <FaUserGraduate className={`text-xl ${
                            field.value === USER_ROLES.PLAYER ? "text-primary" : "text-gray-500"
                          }`} />
                        </div>
                        <h4 className="font-medium">Player</h4>
                        <p className="text-sm text-gray-600 mt-1">Showcase your skills to scouts worldwide</p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                          field.value === USER_ROLES.SCOUT
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                        }`}
                        onClick={() => form.setValue("role", USER_ROLES.SCOUT)}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                          field.value === USER_ROLES.SCOUT
                            ? "bg-primary bg-opacity-10"
                            : "bg-gray-100"
                        }`}>
                          <FaSearch className={`text-xl ${
                            field.value === USER_ROLES.SCOUT ? "text-primary" : "text-gray-500"
                          }`} />
                        </div>
                        <h4 className="font-medium">Scout/Agent</h4>
                        <p className="text-sm text-gray-600 mt-1">Discover talent and manage recruitment</p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 flex flex-col items-center text-center cursor-pointer transition-all ${
                          field.value === USER_ROLES.ACADEMY
                            ? "border-primary bg-primary bg-opacity-5"
                            : "border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                        }`}
                        onClick={() => form.setValue("role", USER_ROLES.ACADEMY)}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                          field.value === USER_ROLES.ACADEMY
                            ? "bg-primary bg-opacity-10"
                            : "bg-gray-100"
                        }`}>
                          <FaBuilding className={`text-xl ${
                            field.value === USER_ROLES.ACADEMY ? "text-primary" : "text-gray-500"
                          }`} />
                        </div>
                        <h4 className="font-medium">Academy Admin</h4>
                        <p className="text-sm text-gray-600 mt-1">Post trials and manage development</p>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Create a password" 
                      type="password" 
                      {...field}
                      onChange={onPasswordChange}
                    />
                  </FormControl>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-500">Password strength:</div>
                      <div className={`text-xs font-medium ${
                        passwordStrength < 30 ? "text-red-500" : 
                        passwordStrength < 60 ? "text-yellow-500" : "text-green-500"
                      }`}>
                        {getStrengthText(passwordStrength)}
                      </div>
                    </div>
                    <Progress value={passwordStrength} className="h-1 bg-gray-200" 
                      indicatorClassName={getStrengthColor(passwordStrength)} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Confirm your password" 
                      type="password" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="termsAccepted"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="termsAccepted" className="text-sm font-normal cursor-pointer">
                      I agree to the <Link href="#" className="text-primary hover:text-primary-dark">Terms of Service</Link> and{" "}
                      <Link href="#" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
