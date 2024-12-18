/* eslint-disable */
import { createClient, http, defineChain } from "viem";
import { hederaTestnet } from "viem/chains";
import { createConfig } from "@privy-io/wagmi";

export const privyConfig = {
  loginMethods: ["google", "email"],
  defaultChain: hederaTestnet,
  supportedChains: [hederaTestnet],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    logo: `https://www.tutela.xyz/vercel.svg`,
  },
  embeddedWallets: {
    createOnLogin: "all-users",
    noPromptOnSignature: false,
  },
  walletConnectCloudProjectId: "957c795c4c86e7c46609c0cd4064fa00",
};

export const supportedChains = [hederaTestnet];

export const wagmiConfig = createConfig({
  //@ts-ignore
  chains: supportedChains,
  client({ chain }: { chain: any }) {
    return createClient({
      chain,
      transport: http(),
    });
  },
});
