import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { africanRegions } from "@/utils/data";

interface Region {
  name: string;
  topicId: string;
}

interface EthContextType {
  index: number;
  address: `0x${string}` | null;
  isAccountModalOpen: boolean;
  network: any;
  switchNetwork: (index: number) => void;
  toggleAccountModal: () => void;
  handleLogin: () => void;
  handleLogout: () => void;
  publicClient: any;
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  currentFarmId: string | null;
  setCurrentFarmId: (farm: string) => void;
}

const EthContext = createContext<EthContextType | undefined>(undefined);

export const Erc4337Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { authenticated, login, logout, connectOrCreateWallet } = usePrivy();
  const { wallets } = useWallets();

  const [index, setIndex] = useState<number>(0);
  const [network, switchNetwork] = useState<any | null>(baseSepolia);
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<Region>(
    africanRegions[0]
  );
  const [currentFarmId, setCurrentFarmId] = useState<string | null>(null);

  useEffect(() => {
    const savedFarmId = localStorage.getItem("currentFarm");
    setCurrentFarmId(savedFarmId);
  }, []);

  const toggleAccountModal = () => setIsAccountModalOpen(!isAccountModalOpen);

  const handleLogin = async () => {
    try {
      if (authenticated) {
        await logout();
      }
      login();
      connectOrCreateWallet();
    } catch (e) {
      console.log((e as any).message as any);
    }
  };

  const handleLogout = async () => {
    try {
      setIsAccountModalOpen(false);
      localStorage.removeItem("currentFarm"); // Clear farm ID on logout
      setCurrentFarmId(null);
      await logout();
    } catch (e) {
      console.log(e);
      console.log((e as any).message);
    }
  };

  const publicClient = createPublicClient({
    chain: network,
    transport: http(),
  });

  return (
    <EthContext.Provider
      value={{
        index,
        address,
        network,
        publicClient,
        isAccountModalOpen,
        toggleAccountModal,
        handleLogin,
        handleLogout,
        switchNetwork,
        selectedRegion,
        setCurrentFarmId,
        setSelectedRegion,
        currentFarmId,
      }}
    >
      {children}
    </EthContext.Provider>
  );
};

export const useEthContext = () => {
  const context = useContext(EthContext);
  if (context === undefined) {
    throw new Error("useEthContext must be used within a Erc4337Provider");
  }
  return context;
};
