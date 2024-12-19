"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms";
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
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import PigStatus from "@/components/molecules/PigStatus";
import { useEthContext } from "@/contexts/EthContext";
import { usePigManagement } from "@/hooks/usePigManagement";
import LiveChat from "@/components/organisms/LiveChat";
import TutelaBanner from "@/components/molecules/tutelaBanner";

export default function Dashboard() {
  const [isDetailedView, setIsDetailedView] = React.useState(false);
  const [monitoringView, setMonitoringView] = React.useState<"map" | "table">(
    "map"
  );

  const { selectedRegion, currentFarmId } = useEthContext();

  const shouldShowFarmView = currentFarmId && isDetailedView;
  const { pigs, stats, isLoading, error, refetchPigs } = usePigManagement(
    shouldShowFarmView ? currentFarmId : null
  );

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-[#1C1C1E] border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Monitored</CardTitle>
          <PiggyBank className="w-4 h-4 text-[#B86EFF]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPigs}</div>
          <p className="text-xs text-gray-400">{0} from yesterday</p>
        </CardContent>
      </Card>

      {currentFarmId && (
        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Alerts
            </CardTitle>
            <BadgeAlert className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.sickPigs}
            </div>
            <p className="text-xs text-gray-400">Requires attention</p>
          </CardContent>
        </Card>
      )}

      {currentFarmId && (
        <Card className="bg-[#1C1C1E] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Index</CardTitle>
            <ThermometerSun className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {((stats.healthyPigs / stats.totalPigs) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Detailed View Component
  const DetailedView = () => (
    <Card className="bg-[#1C1C1E] border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detailed Monitoring</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className={monitoringView === "map" ? "bg-[#B86EFF]" : ""}
              onClick={() => setMonitoringView("map")}
            >
              <MapPin className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              className={monitoringView === "table" ? "bg-[#B86EFF]" : ""}
              onClick={() => setMonitoringView("table")}
            >
              <PiggyBank className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {monitoringView === "map"
            ? "Farm distribution of monitored pigs"
            : "Detailed health data"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monitoringView === "map" ? (
          <div className="relative w-full h-[500px] bg-[#2C2C2E] rounded-lg">
            {pigs.map((pig, i) => (
              <PigStatus
                key={`${pig.pigTopicId}${i}`}
                x={Math.random() * 80 + 10}
                y={Math.random() * 80 + 10}
                hasFever={
                  currentFarmId ? pig.latestStatus?.hasFever : pig.hasFever
                }
                lastUpdate={
                  currentFarmId
                    ? pig.latestStatus?.timestamp || pig.timestamp
                    : pig.lastUpdate
                }
                isNew={currentFarmId ? !pig.latestStatus : false}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFID</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pigs.map((pig: any) => (
                  <TableRow key={pig.pigTopicId}>
                    <TableCell>{pig.rfid}</TableCell>
                    <TableCell>
                      {pig.latestStatus?.temperature?.toFixed(1)}°C
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          pig.latestStatus?.hasFever
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        <ThermometerSun className="w-4 h-4" />
                        {pig.latestStatus?.hasFever ? "Fever" : "Normal"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pig.latestStatus?.timestamp || pig.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Regional View Component
  const RegionalView = () => (
    <Card className="bg-[#1C1C1E] border-gray-800">
      <CardHeader>
        <CardTitle>Live Monitoring</CardTitle>
        <CardDescription>Regional overview of monitored pigs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-[#2C2C2E] rounded-lg">
          {pigs.map((pig: any) => (
            <PigStatus
              key={pig.pigTopicId}
              x={Math.random() * 80 + 10} // We'll need to add positioning logic
              y={Math.random() * 80 + 10}
              hasFever={pig.latestStatus?.hasFever || false}
              lastUpdate={pig.latestStatus?.timestamp || pig.timestamp}
              isNew={!pig.latestStatus}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0d0e14] text-white p-4 md:p-6">
      <NavBar onViewChange={setIsDetailedView} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#B86EFF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <StatsCards />
          <TutelaBanner />
          {currentFarmId && isDetailedView ? (
            <DetailedView />
          ) : (
            <RegionalView />
          )}

          <LiveChat />
        </>
      )}
    </div>
  );
}
