"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          {/* Cute Welcome Animation */}
          <div className="flex justify-center">
            <div className="text-5xl animate-pulse">
              👋
            </div>
          </div>

          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                  Welcome back!
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                          Password
                        </Label>
                        <Link
                          href="/auth/forgot-password"
                          className="ml-auto inline-block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline-offset-4 hover:underline transition-colors"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          placeholder="********"
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/auth/sign-up"
                      className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-4 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2">
             
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Welcome back, we missed you!
              </span>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}