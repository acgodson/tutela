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
      }}
    >
      {children}
    </EthContext.Provider>
  );
};

export const useEthContext = () => {
  const context = useContext(EthContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
