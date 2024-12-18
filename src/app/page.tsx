"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import {
  BadgeAlert,
  PiggyBank,
  ThermometerSun,
  Building,
  LogIn,
  QrCode,
  Plus,
  MapPin,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";

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

const QRScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  // Implement QR scanning logic here
  return (
    <button
      onClick={() => onScan("SAMPLE-RFID-123")}
      className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors"
    >
      <QrCode className="w-6 h-6" />
    </button>
  );
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isRegionalView, setIsRegionalView] = React.useState(true);
  const [selectedRegion, setSelectedRegion] = React.useState("all");
  const [alerts, setAlerts] = React.useState([]);
  const [newRFID, setNewRFID] = React.useState("");
  const [open, setOpen] = React.useState(false);

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

  const handleQRScan = (rfid: string) => {
    setNewRFID(rfid);
  };

  const filteredPigData = pigData.filter((pig) => {
    if (!isAuthenticated) return true; // Show all in regional view
    if (!isRegionalView) return pig.farmerId === "farmer1"; // Show only farmer's pigs
    return selectedRegion === "all" || pig.region === selectedRegion;
  });

  const enhancedPigData = pigData.map((pig) => ({
    ...pig,
    temperature: Math.random() * 2 + 38, // Normal pig temp is around 39°C
    status: pig.hasFever ? "fever" : "healthy",
    subRegion: pig.region === "north" ? "Morocco" : "Kenya", // Example
    coordinates: {
      lat: pig.y,
      lng: pig.x,
    },
  }));

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
    <div className="min-h-screen bg-[#0A0B0F] text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#B86EFF] flex items-center gap-2">
            <Building className="w-6 h-6" />
            Farm Health Monitor
          </h1>
          <p className="text-gray-400">Real-time health tracking system</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <Label htmlFor="view-toggle">Regional View</Label>
                <Switch
                  id="view-toggle"
                  checked={isRegionalView}
                  onCheckedChange={setIsRegionalView}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="detailed-view">Detailed View</Label>
                <Switch
                  id="detailed-view"
                  checked={isDetailedView}
                  onCheckedChange={setIsDetailedView}
                />
              </div>

              {/* 
              <div className="flex items-center gap-2">
                <Label htmlFor="view-toggle">Regional View</Label>
                <Switch
                  id="view-toggle"
                  checked={isRegionalView}
                  onCheckedChange={setIsRegionalView}
                />
              </div> */}

              {/* Test button outside Dialog first */}
              <Button
                className="bg-[#B86EFF] hover:bg-[#A54EFF]"
                onClick={() => setOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Pig
              </Button>

              {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="bg-[#1C1C1E] border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Register New Pig</DialogTitle>
                      <DialogDescription>
                        Enter RFID manually or scan QR code
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={newRFID}
                        onChange={(e) => setNewRFID(e.target.value)}
                        placeholder="Enter RFID"
                        className="bg-[#2C2C2E] border-gray-700"
                      />
                      <QRScanner onScan={handleQRScan} />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-[#B86EFF] hover:bg-[#A54EFF]"
                        onClick={() => {
                          // Add your registration logic here
                          console.log("Registering RFID:", newRFID);
                          setNewRFID(""); // Reset the input
                          setOpen(false); // Close dialog
                        }}
                        disabled={!newRFID} // Disable if no RFID entered
                      >
                        Register
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </>
          ) : (
            <Button
              onClick={() => setIsAuthenticated(true)}
              className="bg-[#B86EFF] hover:bg-[#A54EFF]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Farmer Login
            </Button>
          )}

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40 bg-[#1C1C1E] border-gray-700">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
              {pigData
                .filter(
                  (pig) =>
                    selectedRegion === "all" || pig.region === selectedRegion
                )
                .map((pig) => (
                  <PigStatus key={pig.id} {...pig} />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Feed */}
      <Card className="mt-6 bg-[#1C1C1E] border-gray-800">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-gray-400">No recent alerts</p>
            ) : (
              alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-2 p-3 bg-[#2C2C2E] rounded-lg"
                >
                  <BadgeAlert className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-400">{alert.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
