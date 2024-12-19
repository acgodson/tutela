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
import { AlertCircle, PiggyBank, Check } from "lucide-react";
import QRScanner from "../atoms/QRScanner";
import { usePigManagement } from "@/hooks/usePigManagement";

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
  const {
    rfid,
    setRfid,
    error,
    setError,
    isRegistering,
    handleRegisterPig,
    generateRFID,
  } = usePigManagement(farmId);

  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleQRScan = (scannedRfid: string) => {
    setRfid(scannedRfid);
    setError("");
  };

  const handleSubmit = async () => {
    const success = await handleRegisterPig();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // Hide success message after 3 seconds
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1E] border-gray-800">
        <DialogHeader>
          {!showSuccess && (
            <>
              <DialogTitle className="text-xl font-bold text-white">
                Register New Pig
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter RFID manually or scan QR code
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {showSuccess && (
          <div className="absolute top-0 left-0 right-0 -translate-y-full animate-slide-down z-50">
            <div className="relative bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 mt-4">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white animate-check" />
              </div>
              <div className="flex-1">
                <h4 className="text-green-500 font-semibold">
                  Successfully Registered!
                </h4>
                <p className="text-green-400 text-sm">
                  New pig has been added to your farm
                </p>
              </div>
              <div className="relative w-10 h-10">
                <PiggyBank className="w-10 h-10 text-green-500 animate-bounce" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              value={rfid}
              onChange={(e) => {
                setRfid(e.target.value);
                setError("");
              }}
              placeholder="Enter RFID"
              className="bg-[#2C2C2E] border-gray-700 text-white"
              disabled={isRegistering}
            />
            <QRScanner onScan={handleQRScan} onGenerate={generateRFID} />
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
            disabled={isRegistering}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#B86EFF] hover:bg-[#A54EFF] text-white"
            disabled={!rfid.trim() || isRegistering}
          >
            {isRegistering ? (
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
