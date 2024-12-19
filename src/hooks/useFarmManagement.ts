import { useState } from "react";


export const useFarmManagement = (hederaAddress: string) => {
  const [farms, setFarms] = useState<any>([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [isFarmLoading, setIsFarmLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFarms = async (regionId: string) => {
    if (!hederaAddress || !regionId) {
      console.log("No address or region found");
      return;
    }
    setIsFarmLoading(true);
    try {
      const response = await fetch(
        `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${regionId}`
      );
      const data = await response.json();
      const userFarms = data.messages
        .filter((msg: any) => {
          const farmData = msg.content;
          return farmData.ethAddress === hederaAddress;
        })
        .map((msg: any) => ({
          farmTopicId: msg.content.farmTopicId,
          farmerName: msg.content.farmerName,
          registeredAt: msg.content.timestamp,
        }));

      setFarms(userFarms);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch farms");
    } finally {
      setIsFarmLoading(false);
    }
  };

  const registerFarm = async (regionId: string, farmerName: string) => {
    if (!regionId || !hederaAddress) {
      throw new Error("No account id");
    }

    try {
      const response = await fetch(
        "https://us-central1-chow-live.cloudfunctions.net/registerFarm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ethAddress: hederaAddress,
            regionId,
            farmerName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to register farm");
      await fetchFarms(regionId);
    } catch (err) {
      throw new Error("Failed to register farm");
    }
  };

  return {
    farms,
    selectedFarm,
    setSelectedFarm,
    isFarmLoading,
    error,
    fetchFarms,
    registerFarm,
  };
};
