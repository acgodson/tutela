import { PiggyBank } from "lucide-react";

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

export default PigStatus;
