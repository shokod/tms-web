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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
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
          
          <div className="flex justify-center">
            <div className="text-5xl animate-bounce">
              🚀
            </div>
          </div>

          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                  Create your account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Enter your details below to create your new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
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
                    <div className="grid gap-2">
                      <Label htmlFor="repeat-password" className="text-gray-700 dark:text-gray-300">
                        Repeat Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="repeat-password"
                          type="password"
                          required
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
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
                      {isLoading ? "Creating account..." : "Sign up"}
                    </Button>
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-4 transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Join us today and get started!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}