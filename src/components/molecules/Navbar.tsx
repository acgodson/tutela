import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Building, LogIn, Plus } from "lucide-react";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { useViewMode } from "@/hooks/useViewMode";
import { africanRegions } from "@/utils/data";
import { AddPigDialog } from "./AddPigDialog";
import { useEthContext } from "@/contexts/EthContext";

interface NavBarProps {
  onViewChange: (isDetailed: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onViewChange }) => {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const { selectedRegion, setSelectedRegion, currentFarmId } = useEthContext();
  const { isDetailedView, canAccessDetailedView, toggleView } = useViewMode();
  const [isAddPigDialogOpen, setIsAddPigDialogOpen] = React.useState(false);

  const handleRegionChange = (topicId: string) => {
    const newRegion = africanRegions.find((r) => r.topicId === topicId);
    if (newRegion) {
      setSelectedRegion(newRegion);
    }
  };

  const handleAuthAction = () => {
    router.push("/auth");
  };

  // Propagate view changes to parent
  React.useEffect(() => {
    onViewChange(isDetailedView);
  }, [isDetailedView, onViewChange]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#B86EFF] flex items-center gap-2">
          <Building className="w-6 h-6" />
          FarmMonitor
        </h1>
        <p className="text-gray-400">Real-time monitoring system</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Single View Toggle - Only show when user can access detailed view */}
        {canAccessDetailedView && (
          <div className="flex items-center gap-2">
            <Label htmlFor="view-toggle">
              {isDetailedView ? "Farm View" : "Regional View"}
            </Label>
            <Switch
              id="view-toggle"
              checked={isDetailedView}
              onCheckedChange={toggleView}
            />
          </div>
        )}

        {/* Add Pig Button - Only show when user has a farm */}
        {authenticated && currentFarmId && (
          <Button
            className="bg-[#B86EFF] hover:bg-[#A54EFF]"
            onClick={() => setIsAddPigDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pig
          </Button>
        )}

        {/* Login/Auth Button */}
        {(!authenticated || !currentFarmId) && (
          <Button
            onClick={handleAuthAction}
            className="bg-[#B86EFF] hover:bg-[#A54EFF]"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Farmer Login
          </Button>
        )}

        {/* Region Selector */}
        <Select
          value={selectedRegion.topicId}
          onValueChange={handleRegionChange}
        >
          <SelectTrigger className="w-40 bg-[#1C1C1E] border-gray-700">
            <SelectValue placeholder="Select region">
              {selectedRegion.name}-{selectedRegion.topicId}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {africanRegions.map((region) => (
              <SelectItem key={region.topicId} value={region.topicId}>
                {region.name}-{region.topicId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Pig Dialog */}
      {isAddPigDialogOpen && currentFarmId && (
        <AddPigDialog
          isOpen={isAddPigDialogOpen}
          onClose={() => setIsAddPigDialogOpen(false)}
          farmId={currentFarmId}
        />
      )}
    </div>
  );
};

export default NavBar;
