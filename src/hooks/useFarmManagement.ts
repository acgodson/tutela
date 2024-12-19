import { useEthContext } from "@/contexts/EthContext";
import { trpc } from "@/trpc/client";
import { useState } from "react";

export const useFarmManagement = (hederaAddress: string) => {
  const [selectedFarm, setSelectedFarm] = useState("");

  const [error, setError] = useState("");
  const { selectedRegion } = useEthContext();

  const {
    data: farms = [],
    isLoading: isFarmLoading,
    error: fetchError,
  } = trpc.getFarms.useQuery(
    {
      regionId: selectedRegion.topicId,
      hederaAddress,
    },
    {
      enabled: !!hederaAddress && !!selectedRegion.topicId,
    }
  );

  const { mutateAsync: registerFarm, error: registerError } =
    trpc.registerFarm.useMutation();

  const registerNewFarm = async (regionId: string, farmerName: string) => {
    if (!regionId || !hederaAddress) {
      throw new Error("No account id");
    }

    await registerFarm({
      regionId,
      hederaAddress,
      farmerName,
    });
  };

  return {
    farms,
    selectedFarm,
    setSelectedFarm,
    isFarmLoading,
    error: fetchError || registerError,
    registerFarm: registerNewFarm,
  };
};
