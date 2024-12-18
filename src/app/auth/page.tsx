"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/atoms/card";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/atoms/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/tabs";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle, Home } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#B86EFF]/30 rounded-full animate-pulse" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#B86EFF] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default function AuthPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add authentication logic here
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 bg-[#0A0B0F] shadow-2xl">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8 text-[#B86EFF]" />
              <h2 className="text-3xl font-bold text-[#B86EFF]">FarmMonitor</h2>
            </div>
            <CardDescription className="text-gray-400 text-lg">
              Monitor your farm's health status in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent border-b border-gray-800">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#B86EFF] data-[state=active]:text-white data-[state=active]:bg-transparent bg-transparent text-lg py-4 rounded-none"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#B86EFF] data-[state=active]:text-white data-[state=active]:bg-transparent bg-transparent text-lg py-4 rounded-none"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-lg text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#B86EFF] hover:bg-[#A54EFF] text-white text-lg font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="farmName" className="text-lg text-gray-300">
                      Farm Name
                    </Label>
                    <Input
                      id="farmName"
                      placeholder="Your Farm's Name"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="region" className="text-lg text-gray-300">
                      Region
                    </Label>
                    <Input
                      id="region"
                      placeholder="Farm Region"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="registerEmail"
                      className="text-lg text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="registerPassword"
                      className="text-lg text-gray-300"
                    >
                      Password
                    </Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      required
                      className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#B86EFF] hover:bg-[#A54EFF] text-white text-lg font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
