// hooks/useDashboardData.ts
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/evm/EthContext";
import { PigData, DashboardStats } from "@/utils/dashboardTypes";

export const useDashboardData = (regionId: string) => {
  const { authenticated } = usePrivy();
  const { currentFarmId } = useEthContext(); // Get currentFarmId from context instead of localStorage

  const [pigData, setPigData] = useState<PigData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMonitored: 0,
    currentAlerts: 0,
    healthIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // If authenticated and has farm, fetch farm-specific data
        if (authenticated && currentFarmId) {
          const response = await fetch(
            `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${currentFarmId}`
          );
          const data = await response.json();
          setPigData(data.messages);
        } else {
          // Fetch regional data
          const response = await fetch(
            `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${regionId}`
          );
          const data = await response.json();
          setPigData(data.messages);
        }

        calculateStats();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    const calculateStats = () => {
      const alertCount = pigData.filter((pig) => pig.hasFever).length;
      setStats({
        totalMonitored: pigData.length,
        currentAlerts: alertCount,
        healthIndex:
          pigData.length > 0
            ? ((pigData.length - alertCount) / pigData.length) * 100
            : 0,
        dailyChange: 2,
      });
    };

    fetchData();
  }, [regionId, authenticated, currentFarmId]);

  return {
    pigData,
    stats,
    isLoading,
    error,
    currentFarmId,
    isAuthenticated: authenticated,
  };
};
