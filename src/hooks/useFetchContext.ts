import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import { useEthContext } from "@/contexts/EthContext";

interface ContextData {
  summary: string;
  details: string;
}

interface PigHealthSummary {
  total: number;
  healthy: number;
  sick: number;
  avgTemp?: number;
}

export interface UseFetchContextReturn {
  contextData: ContextData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Helper functions for formatting data
const formatFarmSummary = (data: PigHealthSummary): string => {
  return `Farm Summary: Total Pigs: ${data.total}, Healthy: ${
    data.healthy
  }, Sick: ${data.sick}${
    data.avgTemp ? `, Average Temperature: ${data.avgTemp.toFixed(1)}°C` : ""
  }`;
};

const formatRegionalSummary = (
  data: PigHealthSummary,
  farmCount: number
): string => {
  return `Regional Summary: Total Farms: ${farmCount}, Total Pigs: ${data.total}, Healthy: ${data.healthy}, Sick: ${data.sick}`;
};

const formatPigDetails = (pigs: any[]): string => {
  return pigs
    .map((pig) => {
      const status = pig.latestStatus || pig;
      return `RFID: ${pig.rfid}, Status: ${
        status.hasFever ? "Fever" : "Normal"
      }${
        status.temperature ? `, Temp: ${status.temperature.toFixed(1)}°C` : ""
      }, Last Update: ${status.timestamp || pig.lastUpdate || "N/A"}`;
    })
    .join("\n");
};

export const useFetchContext = (farmId: string | null) => {
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedRegion } = useEthContext();

  // Farm-specific data query
  const farmQuery = trpc.getPigs.useQuery(
    { farmTopicId: farmId! },
    { enabled: !!farmId }
  );

  // Regional overview query
  const regionalQuery = trpc.getRegionalOverview.useQuery(
    { regionId: selectedRegion.topicId },
    { enabled: !farmId }
  );

  useEffect(() => {
    const generateContext = async () => {
      setIsLoading(true);
      try {
        if (farmId && farmQuery.data) {
          // Farm View Context
          const pigData = farmQuery.data;
          const healthSummary: PigHealthSummary = {
            total: pigData.length,
            healthy: pigData.filter((pig) => !pig.latestStatus?.hasFever)
              .length,
            sick: pigData.filter((pig) => pig.latestStatus?.hasFever).length,
            avgTemp:
              pigData.reduce((acc, pig) => {
                return pig.latestStatus?.temperature
                  ? acc + pig.latestStatus.temperature
                  : acc;
              }, 0) / pigData.length || undefined,
          };

          setContextData({
            summary: formatFarmSummary(healthSummary),
            details: formatPigDetails(pigData),
          });
        } else if (regionalQuery.data) {
          // Regional View Context
          const { stats, pigs } = regionalQuery.data;
          const healthSummary: PigHealthSummary = {
            total: stats.totalPigs,
            healthy: stats.healthyPigs,
            sick: stats.sickPigs,
          };

          setContextData({
            summary: formatRegionalSummary(healthSummary, stats.farmCount),
            details: formatPigDetails(pigs),
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate context"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if ((farmId && farmQuery.data) || (!farmId && regionalQuery.data)) {
      generateContext();
    }
  }, [farmId, farmQuery.data, regionalQuery.data]);

  return {
    contextData,
    isLoading: isLoading || farmQuery.isLoading || regionalQuery.isLoading,
    error: error || farmQuery.error || regionalQuery.error,
    refetch: farmId ? farmQuery.refetch : regionalQuery.refetch,
  };
};
