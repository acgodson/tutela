import { Copy } from "lucide-react";
import { Button } from "../atoms";

const AddressDisplay = ({ evmAddress, hederaAddress, onCopy }: any) => {
  return (
    <div className="flex flex-col gap-2 mb-6 p-4 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">EVM Address:</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-mono text-sm">
            {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(evmAddress)}
            className="hover:bg-white/10"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {hederaAddress && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Account id:</span>
          <span className="text-white font-mono text-sm">{hederaAddress}</span>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
