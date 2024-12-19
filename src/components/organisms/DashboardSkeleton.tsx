import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/atoms/card";
import {
  PiggyBank,
  BadgeAlert,
  ThermometerSun,
  LucideIcon,
} from "lucide-react";
import TutelaBanner from "../molecules/tutelaBanner";

const loadingMessages = [
  "Connecting to your smart farm...",
  "Gathering pig health data...",
  "Analyzing temperature readings...",
];

const SkeletonCard = ({ icon: Icon }: { icon: LucideIcon }) => (
  <Card className="bg-[#1C1C1E] border-gray-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="h-4 w-32 bg-gray-800 animate-pulse rounded" />
      <Icon className="w-4 h-4 text-gray-800" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-16 bg-gray-800 animate-pulse rounded mb-2" />
      <div className="h-3 w-24 bg-gray-800 animate-pulse rounded" />
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard icon={PiggyBank} />
        <SkeletonCard icon={BadgeAlert} />
        <SkeletonCard icon={ThermometerSun} />
      </div>

      <TutelaBanner />

      {/* Main Content Area Skeleton */}
      <Card className="bg-[#1C1C1E] border-gray-800">
        <CardHeader>
          <div className="h-6 w-48 bg-gray-800 animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-gray-800 animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[500px] bg-[#2C2C2E] rounded-lg flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#B86EFF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">
              {loadingMessages[messageIndex]}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
