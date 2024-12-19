import { trpc } from "@/trpc/client";
import { useState } from "react";

export const usePigManagement = (farmId: string) => {
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState("");

  // Fetch pigs data
  const {
    data: pigs = [] as any,
    isLoading: isLoadingPigs,
    error: fetchError,
    refetch: refetchPigs,
  } = trpc.getPigs.useQuery(
    { farmTopicId: farmId },
    {
      enabled: !!farmId,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

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
        farmTopicId: farmId,
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

  // Get statistical data
  const stats = {
    totalPigs: pigs.length,
    healthyPigs: pigs.filter((pig: any) => !pig.latestStatus?.hasFever).length,
    sickPigs: pigs.filter((pig: any) => pig.latestStatus?.hasFever).length,
    averageTemperature:
      pigs.reduce((acc: any, pig: any) => {
        return pig.latestStatus?.temperature
          ? acc + pig.latestStatus.temperature
          : acc;
      }, 0) / pigs.length || 0,
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
    isLoadingPigs,
    refetchPigs,
    stats,

    // Combined loading state
    isLoading: isLoadingPigs || isRegistering,
  };
};
