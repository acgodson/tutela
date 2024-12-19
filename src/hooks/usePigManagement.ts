//usepigmanagement.tsx

import { useEthContext } from "@/contexts/EthContext";
import { trpc } from "@/trpc/client";
import { useState } from "react";

export const usePigManagement = (farmId: string | null) => {
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState("");
  const { selectedRegion } = useEthContext();

  // Farm-specific data
  const farmQuery = trpc.getPigs.useQuery(
    { farmTopicId: farmId! },
    {
      enabled: !!farmId,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Regional overview
  const regionalQuery = trpc.getRegionalOverview.useQuery(
    { regionId: selectedRegion.topicId },
    {
      enabled: !farmId,
      refetchInterval: 60000,
    }
  );

  const currentQuery = farmId ? farmQuery : regionalQuery;

  const pigs = farmId
    ? farmQuery.data || [] // Farm view returns array directly
    : regionalQuery.data?.pigs || [];

  // Compute combined stats
  const stats = farmId
    ? {
        totalPigs: farmQuery.data?.length || 0,
        healthyPigs:
          farmQuery.data?.filter((pig) => !pig.latestStatus?.hasFever).length ||
          0,
        sickPigs:
          farmQuery.data?.filter((pig) => pig.latestStatus?.hasFever).length ||
          0,
      }
    : {
        totalPigs: regionalQuery.data?.stats.totalPigs || 0,
        healthyPigs: regionalQuery.data?.stats.healthyPigs || 0,
        sickPigs: regionalQuery.data?.stats.sickPigs || 0,
      };

  // Register new pig
  const { mutateAsync: registerPig, isPending: isRegistering } =
    trpc.registerPig.useMutation({
      onError: (error) => {
        setError(error.message);
      },
    });

  // Generate RFID
  const { data: generatedRFID, refetch: generateNewRFID } =
    trpc.generateRFID.useQuery(undefined, {
      enabled: false,
    });

  const handleRegisterPig = async () => {
    if (!rfid.trim()) {
      setError("RFID is required");
      return false;
    }

    try {
      await registerPig({
        rfid,
        farmTopicId: farmId!,
      });
      setRfid("");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register pig");
      return false;
    }
  };

  const generateRFID = async () => {
    const { data } = await generateNewRFID();
    if (data?.rfid) {
      setRfid(data.rfid);
      setError("");
    }
  };



  return {
    // Registration related
    rfid,
    setRfid,
    error,
    setError,
    isRegistering,
    handleRegisterPig,
    generateRFID,

    // Fetch related

    pigs,
    stats,
    isLoadingPigs: currentQuery.isLoading,
    refetchPigs: currentQuery.refetch,
    farmCount: regionalQuery.data?.stats.farmCount,

    // Combined loading state
    isLoading: currentQuery.isLoading || isRegistering,
  };
};
