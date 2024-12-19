import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/contexts/EthContext";

export const useViewMode = () => {
  const { authenticated } = usePrivy();
  const { currentFarmId } = useEthContext();
  const [isDetailedView, setIsDetailedView] = useState(false);

  // Determine if user can access detailed view
  const canAccessDetailedView = authenticated && Boolean(currentFarmId);

  // Reset to regional view if user can't access detailed view
  useEffect(() => {
    if (!canAccessDetailedView && isDetailedView) {
      setIsDetailedView(false);
    }
  }, [canAccessDetailedView, isDetailedView]);

  const toggleView = (value: boolean) => {
    if (!canAccessDetailedView) return;
    setIsDetailedView(value);
  };

  return {
    isDetailedView,
    canAccessDetailedView,
    toggleView,
  };
};
