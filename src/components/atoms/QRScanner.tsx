// components/atoms/QRScanner.tsx
import { QrCode } from "lucide-react";
import { Button } from "@/components/atoms";

interface QRScannerProps {
  onScan: (data: string) => void;
  onGenerate: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onGenerate }) => {
  return (
    <Button
      variant="ghost"
      onClick={onGenerate} // We'll use generate instead of scan for now
      className="h-14 px-3 hover:bg-[#2C2C2E] hover:text-[#B86EFF] transition-colors"
      title="Generate RFID"
      type="button"
    >
      <QrCode className="w-6 h-6" />
    </Button>
  );
};

export default QRScanner;
