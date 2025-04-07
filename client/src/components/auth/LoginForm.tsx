import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/authContext";
import { Link } from "wouter";
import { loginSchema } from "@shared/schema";
import { FaGoogle, FaApple } from "react-icons/fa";

// Extend the login schema for the 'remember me' option
const formSchema = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <Card className="w-full md:w-1/2 border-0 md:border">
      <CardContent className="p-8 sm:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your email" 
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
                  <div className="flex justify-between items-center mb-1">
                    <FormLabel>Password</FormLabel>
                    <Link href="#" className="text-sm text-primary hover:text-primary-dark">
                      Forgot Password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Your password" 
                      type="password" 
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      id="rememberMe"
                    />
                  </FormControl>
                  <FormLabel htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-white hover:text-black transition-colors" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="flex justify-center items-center">
                <FaGoogle className="mr-2" /> Google
              </Button>
              <Button variant="outline" type="button" className="flex justify-center items-center">
                <FaApple className="mr-2" /> Apple
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:text-primary-dark font-medium">
                Create account
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
