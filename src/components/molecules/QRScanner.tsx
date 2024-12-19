import { QrCode } from "lucide-react";

const QRScanner = ({ onScan }: { onScan: (data: string) => void }) => {
  // TODO: Implement QR scanning logic here
  // currently generenate random rfid on scan for web testers
  return (
    <button
      onClick={() => onScan("SAMPLE-RFID-123")}
      className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors"
    >
      <QrCode className="w-6 h-6" />
    </button>
  );
};


export default QRScanner