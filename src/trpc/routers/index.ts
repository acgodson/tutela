import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { customAlphabet } from "nanoid";
import { getAccountIdFromEvmAddress, sendMinimalHbar } from "@/evm/queries";
import { HealthStatusMessage, PigMessage } from "@/utils/dashboardTypes";

const generateRFID = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export const appRouter = createTRPCRouter({
  getHederaAddress: baseProcedure
    .input(
      z.object({
        evmAddress: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const accountId = await getAccountIdFromEvmAddress(input.evmAddress);
        return {
          hederaAddress: accountId.toString(),
          isNewAccount: false,
        };
      } catch (error) {
        return {
          hederaAddress: null,
          isNewAccount: true,
        };
      }
    }),

  sendMinimalHbar: baseProcedure
    .input(
      z.object({
        evmAddress: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendMinimalHbar(input.evmAddress);
        // Return new account ID after sending HBAR
        const accountId = await getAccountIdFromEvmAddress(input.evmAddress);
        return {
          success: true,
          hederaAddress: accountId.toString(),
        };
      } catch (error) {
        throw new Error("Failed to send HBAR");
      }
    }),

  getFarms: baseProcedure
    .input(
      z.object({
        regionId: z.string(),
        hederaAddress: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await fetch(
          `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${input.regionId}`
        );
        const data = await response.json();

        return data.messages
          .filter((msg: any) => {
            const farmData = msg.content;
            return farmData.ethAddress === input.hederaAddress;
          })
          .map((msg: any) => ({
            farmTopicId: msg.content.farmTopicId,
            farmerName: msg.content.farmerName,
            registeredAt: msg.content.timestamp,
          }));
      } catch (error) {
        throw new Error("Failed to fetch farms");
      }
    }),

  registerFarm: baseProcedure
    .input(
      z.object({
        regionId: z.string(),
        hederaAddress: z.string(),
        farmerName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          "https://us-central1-chow-live.cloudfunctions.net/registerFarm",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ethAddress: input.hederaAddress,
              regionId: input.regionId,
              farmerName: input.farmerName,
            }),
          }
        );

        if (!response.ok) throw new Error("Failed to register farm");

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Failed to register farm");
      }
    }),

  registerPig: baseProcedure
    .input(
      z.object({
        rfid: z.string(),
        farmTopicId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await fetch(
          "https://us-central1-chow-live.cloudfunctions.net/registerPig",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rfid: input.rfid,
              farmTopicId: input.farmTopicId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to register pig");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to register pig"
        );
      }
    }),
  generateRFID: baseProcedure.query(() => {
    return {
      rfid: generateRFID(),
    };
  }),

  getPigs: baseProcedure
    .input(
      z.object({
        farmTopicId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Step 1: Get all pig registrations from farm topic
        const farmResponse = await fetch(
          `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${input.farmTopicId}`
        );

        if (!farmResponse.ok) {
          throw new Error("Failed to fetch farm data");
        }

        const farmData = await farmResponse.json();
        const pigRegistrations = farmData.messages.filter(
          (msg: PigMessage) => msg.content.pigTopicId && msg.content.rfid
        );

        // Step 2: Fetch health status for each pig
        const pigStatusPromises = pigRegistrations.map(
          async (pig: PigMessage) => {
            const statusResponse = await fetch(
              `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${pig.content.pigTopicId}`
            );

            if (!statusResponse.ok) {
              return {
                ...pig.content,
                latestStatus: null,
                error: "Failed to fetch status",
              };
            }

            const statusData = await statusResponse.json();
            const healthUpdates = statusData.messages as HealthStatusMessage[];

            // Get the latest health status
            const latestStatus =
              healthUpdates.length > 0
                ? healthUpdates.sort(
                    (a, b) =>
                      new Date(b.content.timestamp).getTime() -
                      new Date(a.content.timestamp).getTime()
                  )[0].content
                : null;

            return {
              ...pig.content,
              latestStatus,
            };
          }
        );

        const pigsWithStatus = await Promise.all(pigStatusPromises);
        return pigsWithStatus;
      } catch (error) {
        throw new Error("Failed to fetch pigs data");
      }
    }),
});

export type AppRouter = typeof appRouter;
