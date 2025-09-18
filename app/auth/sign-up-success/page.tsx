import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          {/* Cute Success Animation */}
          <div className="flex justify-center">
            <div className="text-6xl animate-bounce">
              🎉
            </div>
          </div>

          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="text-center space-y-3 pb-6">
              <CardTitle className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Check your email to confirm
              </CardDescription>
            </CardHeader>
                     
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  You&apos;ve successfully signed up. Please check your email to
                  confirm your account before signing in.
                </p>
              </div>

              <Link href="/auth/login" className="block">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Login
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 pt-2">
                
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  We&apos;re excited to have you!
                </span>
               
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}