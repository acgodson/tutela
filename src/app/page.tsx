"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Input, Button } from "@/components/atoms/";

import { BadgeAlert, PiggyBank, ThermometerSun, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import NavBar from "@/components/molecules/Navbar";
import { usePrivy } from "@privy-io/react-auth";

const PigStatus = ({ x, y, hasFever, lastUpdate, isNew = false }: any) => (
  <div
    className={`absolute transition-colors duration-500 cursor-pointer
      ${
        isNew ? "text-gray-500" : hasFever ? "text-red-500" : "text-green-500"
      }`}
    style={{ left: `${x}%`, top: `${y}%` }}
    title={`Last Updated: ${lastUpdate}`}
  >
    <PiggyBank className="w-6 h-6" />
  </div>
);

export default function Dashboard() {
  const { user } = usePrivy();

  const [isDetailedView, setIsDetailedView] = React.useState(false);
  const [monitoringView, setMonitoringView] = React.useState<"map" | "table">(
    "map"
  );

  // Mock data - replace with real data from your API
  const pigData = [
    {
      id: 1,
      x: 20,
      y: 30,
      hasFever: false,
      lastUpdate: "2 mins ago",
      region: "north",
      farmerId: "farmer1",
    },
    {
      id: 2,
      x: 45,
      y: 60,
      hasFever: true,
      lastUpdate: "1 min ago",
      region: "north",
      farmerId: "farmer1",
    },
    {
      id: 3,
      x: 70,
      y: 40,
      hasFever: false,
      lastUpdate: "5 mins ago",
      region: "south",
      farmerId: "farmer2",
    },
    {
      id: 4,
      x: 30,
      y: 70,
      isNew: true,
      lastUpdate: "Just registered",
      region: "south",
      farmerId: "farmer1",
    },
  ];

  const filteredPigData = pigData.filter((pig) => {
    if (!user) return true; // Show all in regional view
    // it shoulf be regional by default but can be filtered down to farm is the farmer is authenticated
  });

  // Render function for detailed view
  const renderDetailedView = () => (
    <Card className="bg-[#1C1C1E] border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detailed Monitoring</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className={`${monitoringView === "map" ? "bg-[#B86EFF]" : ""}`}
              onClick={() => setMonitoringView("map")}
            >
              <MapPin className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              className={`${monitoringView === "table" ? "bg-[#B86EFF]" : ""}`}
              onClick={() => setMonitoringView("table")}
            >
              <PiggyBank className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {monitoringView === "map"
            ? "Geographic distribution of monitored pigs"
            : "Detailed health data"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monitoringView === "map" ? (
          <div className="relative w-full h-[500px] bg-[#2C2C2E] rounded-lg">
            {/* Your existing map view */}
            {filteredPigData.map((pig) => (
              <PigStatus key={pig.id} {...pig} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPigData.map((pig: any) => (
                  <TableRow key={pig.id}>
                    <TableCell>{pig.id}</TableCell>
                    <TableCell>{`${pig.region} - ${pig.subRegion}`}</TableCell>
                    <TableCell>{pig.temperature?.toFixed(1)}°C</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          pig.status === "fever"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        <ThermometerSun className="w-4 h-4" />
                        {pig.status}
                      </span>
                    </TableCell>
                    <TableCell>{pig.lastUpdate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0d0e14] text-white p-4 md:p-6">
      <NavBar
        setIsDetailedView={setIsDetailedView}
        isDetailedView={isDetailedView}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monitored
            </CardTitle>
            <PiggyBank className="w-4 h-4 text-[#B86EFF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-gray-400">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Alerts
            </CardTitle>
            <BadgeAlert className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-gray-400">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Index</CardTitle>
            <ThermometerSun className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">98.8%</div>
            <p className="text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Monitoring Area */}
      {isDetailedView ? (
        renderDetailedView()
      ) : (
        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader>
            <CardTitle>Live Monitoring</CardTitle>
            <CardDescription>
              Each icon represents a monitored pig
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] bg-[#2C2C2E] rounded-lg">
              {/* display mapped pig status here for all pigs in the farm/ aggregated regions */}
              {/* <PigStatus key={pig.id} {...pig} />  */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
