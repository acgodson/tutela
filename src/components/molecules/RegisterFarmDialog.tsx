import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms";
import { Label } from "@/components/atoms/label";
import React from "react";

interface RegisterFarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { farmerName: string; regionId: string }) => void;
  regionId: string;
}

export const RegisterFarmDialog = ({
  isOpen,
  onClose,
  onSubmit,
  regionId,
}: RegisterFarmDialogProps) => {
  const [farmerName, setFarmerName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ farmerName, regionId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0B0F] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Register New Farm
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-3">
            <Label htmlFor="farmerName" className="text-lg text-gray-300">
              Farmer Name
            </Label>
            <Input
              id="farmerName"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="Enter Unique name"
              required
              className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-14 bg-[#B86EFF] hover:bg-[#A54EFF] text-white text-lg font-medium"
          >
            Register Farm
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
