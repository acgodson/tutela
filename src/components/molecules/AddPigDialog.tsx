// components/molecules/AddPigDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input, Button } from "@/components/atoms";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { AlertCircle } from "lucide-react";
import QRScanner from "../atoms/QRScanner";

interface AddPigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farmId: string;
}

export const AddPigDialog: React.FC<AddPigDialogProps> = ({
  isOpen,
  onClose,
  farmId,
}) => {
  const [rfid, setRfid] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleQRScan = (scannedRfid: string) => {
    setRfid(scannedRfid);
    setError(""); // Clear any previous errors
  };

  const handleSubmit = async () => {
    if (!rfid.trim()) {
      setError("RFID is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://us-central1-chow-live.cloudfunctions.net/registerPig",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rfid,
            farmTopicId: farmId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register pig");
      }

      const data = await response.json();
      console.log("Pig registered successfully:", data);

      // Clear form and close dialog
      setRfid("");
      onClose();
    } catch (err) {
      console.error("Error registering pig:", err);
      setError(err instanceof Error ? err.message : "Failed to register pig");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1E] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Register New Pig
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter RFID manually or scan QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              value={rfid}
              onChange={(e) => {
                setRfid(e.target.value);
                setError(""); // Clear error when user types
              }}
              placeholder="Enter RFID"
              className="bg-[#2C2C2E] border-gray-700 text-white"
              disabled={isLoading}
            />
            <QRScanner onScan={handleQRScan} />
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/50"
            >
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#B86EFF] hover:bg-[#A54EFF] text-white"
            disabled={!rfid.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
