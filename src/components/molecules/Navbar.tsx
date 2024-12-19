"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { Input, Button } from "@/components/atoms/";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Building, LogIn, Plus } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import QRScanner from "./QRScanner";
import { africanRegions } from "@/utils/data";
import { useRouter } from "next/navigation";

const NavBar = ({
  setIsDetailedView,
  isDetailedView,
}: {
  setIsDetailedView: any;
  isDetailedView: boolean;
}) => {
  const { user } = usePrivy();
  const router = useRouter();
  const [isRegionalView, setIsRegionalView] = React.useState(true);
  const [newRFID, setNewRFID] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState(
    africanRegions[0].name
  );
  const [open, setOpen] = React.useState(false);

  const handleQRScan = (rfid: string) => {
    setNewRFID(rfid);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#B86EFF] flex items-center gap-2">
            <Building className="w-6 h-6" />
            FarmMonitor
          </h1>
          <p className="text-gray-400">Real-time monitoring system</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {user ? (
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
              onClick={
                /*go to auth page*/ () => {
                  router.push("auth/");
                }
              }
              className="bg-[#B86EFF] hover:bg-[#A54EFF]"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Farmer Login
            </Button>
          )}

          <Select
            value={(selectedRegion as any).name}
            onValueChange={setSelectedRegion}
            defaultValue={africanRegions[0].name}
          >
            <SelectTrigger className="w-40 bg-[#1C1C1E] border-gray-700">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {africanRegions.map((x) => (
                <SelectItem key={x.topicId} value={x.name}>
                  {x.name}-{x.topicId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default NavBar;
