"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useEthContext } from "@/contexts/EthContext";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/atoms/card";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { AlertCircle, Building, Plus, Route } from "lucide-react";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import AddressDisplay from "@/components/molecules/AddressDisplay";
import { useRouter } from "next/navigation";
import { RegisterFarmDialog } from "@/components/molecules/RegisterFarmDialog";
import { useFarmManagement } from "@/hooks/useFarmManagement";
import { useRegionManagement } from "@/hooks/useRegionManagement";
import { useHederaAddress } from "@/hooks/useHederaAddress";
import LoadingOverlay from "@/components/atoms/LoadingOverlay";

export default function AuthPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const { handleLogin, setCurrentFarmId } = useEthContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Custom hooks
  const {
    hederaAddress,
    isNewAccount,
    error: hederaError,
  } = useHederaAddress(user?.wallet?.address);

  const {
    selectedFarm,
    setSelectedFarm,
    isFarmLoading,
    error: farmError,
    farms,
    registerFarm,
  } = useFarmManagement(hederaAddress);

  const { regionId, handleRegionChange, regions } = useRegionManagement();

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated) {
      await handleLogin();
    }
  };

  const handleFarmSelect = (farmId: string) => {
    if (farmId === "new") {
      setIsDialogOpen(true);
    } else {
      setSelectedFarm(farmId);
    }
  };

  const handleRegisterFarm = async (formData: { farmerName: string }) => {
    setIsLoading(true);
    try {
      await registerFarm(regionId, formData.farmerName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-[#0d0e14] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 bg-[#0A0B0F] shadow-2xl">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-8 h-8 text-[#B86EFF]" />
              <h2 className="text-3xl font-bold text-[#B86EFF]">FarmMonitor</h2>
            </div>
            <CardDescription className="text-gray-400 text-lg">
              Monitor your farm's health status in real-time
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {authenticated && user?.wallet?.address && (
              <AddressDisplay
                evmAddress={user.wallet.address}
                hederaAddress={hederaAddress}
                onCopy={handleCopyAddress}
              />
            )}

            {isNewAccount && (
              <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/50">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500">
                  Setting up your Hedera account with initial HBAR...
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegionSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="region" className="text-lg text-gray-300">
                  Region ID
                </Label>
                <Select value={regionId} onValueChange={handleRegionChange}>
                  <SelectTrigger className="bg-[#1C1C1E] border-gray-800 h-45 focus:border-[#B86EFF] w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1C1E] pt-2 pb-4 border-[#1C1C1E] cursor-pointer">
                    {regions.map((region: any) => (
                      <SelectItem key={region.topicId} value={region.topicId}>
                        {region.name} ({region.topicId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {regionId && hederaAddress && (
                <div className="space-y-3">
                  <Label htmlFor="farm" className="text-lg text-gray-300">
                    Select Farm
                  </Label>
                  <Select onValueChange={handleFarmSelect} value={selectedFarm}>
                    <SelectTrigger className="h-14 bg-white/5 border-gray-800 focus:border-[#B86EFF] text-white">
                      {isFarmLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#B86EFF] border-t-transparent rounded-full animate-spin" />
                          <span>Loading farms...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a farm" />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0B0F] border-gray-800">
                      {farms.map((farm: any) => (
                        <SelectItem
                          key={farm.farmTopicId}
                          value={farm.farmTopicId}
                        >
                          {farm.farmerName} ({farm.farmTopicId})
                        </SelectItem>
                      ))}
                      <SelectItem value="new" className="text-[#B86EFF]">
                        <div className="flex items-center cursor-pointer">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Farm
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(hederaError || farmError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {hederaError || farmError?.message}
                  </AlertDescription>
                </Alert>
              )}

              {!authenticated && (
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#B86EFF] hover:bg-[#A54EFF] text-white text-lg font-medium"
                >
                  Connect Wallet
                </Button>
              )}
            </form>

            {hederaAddress && selectedFarm && (
              <Button
                type="button"
                onClick={() => {
                  localStorage.setItem("currentFarm", selectedFarm);
                  setCurrentFarmId(selectedFarm);
                  router.push("/");
                }}
                className="w-full h-14 mt-4 bg-[#B86EFF] hover:bg-[#A54EFF] text-white text-lg font-medium"
              >
                {isFarmLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Sign into Farm"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <RegisterFarmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleRegisterFarm}
        regionId={regionId}
      />
    </>
  );
}
