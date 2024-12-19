import { getAccountIdFromEvmAddress, sendMinimalHbar } from "@/evm/queries";
import { trpc } from "@/trpc/client";
import { AccountId, Client, PrivateKey } from "@hashgraph/sdk";
import { useEffect, useState } from "react";

export const useHederaAddress = (walletAddress: string | undefined) => {
  const [hederaAddress, setHederaAddress] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync: sendMinimalHbar } = trpc.sendMinimalHbar.useMutation({});

  const { data: hederaData, isLoading } = trpc.getHederaAddress.useQuery(
    { evmAddress: walletAddress || "" },
    {
      enabled: !!walletAddress,
      retry: false,
    }
  );

  // const convertToHederaAddress = async (evmAddress: string) => {
  //   try {
  //     //@ts-ignore
  //     //   const client = Client.forNetwork("testnet").setOperator(
  //     //     AccountId.fromString(process.env.NEXT_PUBLIC_ACCOUNT_ID as string),
  //     //     PrivateKey.fromStringECDSA(
  //     //       process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY as string
  //     //     )
  //     //   );
  //     try {
  //       const accountId = await getAccountIdFromEvmAddress(evmAddress);
  //       setHederaAddress(accountId.toString());
  //       setIsNewAccount(false);
  //     } catch (error) {
  //       setIsNewAccount(true);
  //       await sendMinimalHbar(evmAddress);
  //       const accountId = await getAccountIdFromEvmAddress(evmAddress);
  //       setHederaAddress(accountId.toString());
  //       setIsNewAccount(false);
  //     }
  //   } catch (error) {
  //     console.error("Failed to convert address:", error);
  //     setError("Failed to set up Hedera address");
  //   }
  // };

  useEffect(() => {
    const setupHederaAddress = async () => {
      if (hederaData) {
        if (hederaData.isNewAccount) {
          setIsNewAccount(true);
          try {
            await sendMinimalHbar({ evmAddress: walletAddress! });
            setIsNewAccount(false);
            if (hederaData.hederaAddress) {
              setHederaAddress(hederaData.hederaAddress);
            }
          } catch (error) {
            setError("Failed to setup Hedera account");
          }
        } else if (hederaData.hederaAddress) {
          setHederaAddress(hederaData.hederaAddress);
        }
      }
    };

    setupHederaAddress();
  }, [hederaData, walletAddress]);

  return { hederaAddress, isNewAccount, error, isLoading };
};
