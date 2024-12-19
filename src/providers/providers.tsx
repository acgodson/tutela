"use client";

import { privyConfig, wagmiConfig } from "@/evm/config";
import { WagmiProvider } from "@privy-io/wagmi";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Erc4337Provider } from "@/evm/EthContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={"cm4v2jplr043zdvpuzisf6jfr"}
      config={privyConfig as PrivyClientConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <Erc4337Provider>{children}</Erc4337Provider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
