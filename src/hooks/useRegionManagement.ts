import { useState } from "react";
import { africanRegions } from "@/utils/data";

export const useRegionManagement = () => {
  const [regionId, setRegionId] = useState<string>(africanRegions[0].topicId);

  const handleRegionChange = (newRegionId: string) => {
    setRegionId(newRegionId);
  };

  return {
    regionId,
    handleRegionChange,
    regions: africanRegions,
  };
};
