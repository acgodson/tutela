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

    
  getRegionalOverview: baseProcedure
    .input(
      z.object({
        regionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        // Step 1: Get all farms in the region
        const regionResponse = await fetch(
          `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${input.regionId}`
        );

        if (!regionResponse.ok) throw new Error("Failed to fetch region data");
        const regionData = await regionResponse.json();

        // Extract all farm IDs
        const farmIds = regionData.messages.map(
          (msg: any) => msg.content.farmTopicId
        );

        // Step 2: Fetch aggregated data for all farms (parallel)
        const farmDataPromises = farmIds.map(async (farmId: string) => {
          const farmResponse = await fetch(
            `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${farmId}`
          );

          if (!farmResponse.ok) return null;
          const farmData = await farmResponse.json();

          // Only get pig IDs and their latest status
          const pigs = farmData.messages
            .filter(
              (msg: PigMessage) => msg.content.pigTopicId && msg.content.rfid
            )
            .map((msg: PigMessage) => ({
              pigTopicId: msg.content.pigTopicId,
              rfid: msg.content.rfid,
              farmId,
              timestamp: msg.content.timestamp,
            }));

          return pigs;
        });

        const farmsData = (await Promise.all(farmDataPromises))
          .filter(Boolean)
          .flat();

        // Step 3: Quick health check (only most recent status)
        const healthChecks = farmsData.map(async (pig) => {
          const statusResponse = await fetch(
            `https://us-central1-chow-live.cloudfunctions.net/getTopicMessages?topicId=${pig.pigTopicId}`
          );

          if (!statusResponse.ok) return { ...pig, hasFever: false };

          const statusData = await statusResponse.json();
          const latestStatus = statusData.messages[0]?.content; // Only get the most recent

          return {
            ...pig,
            hasFever: latestStatus?.hasFever || false,
            temperature: latestStatus?.temperature,
            lastUpdate: latestStatus?.timestamp || pig.timestamp,
          };
        });

        const pigsWithStatus = await Promise.all(healthChecks);

        // Aggregate stats
        const stats = {
          totalPigs: pigsWithStatus.length,
          sickPigs: pigsWithStatus.filter((pig) => pig.hasFever).length,
          healthyPigs: pigsWithStatus.filter((pig) => !pig.hasFever).length,
          farmCount: farmIds.length,
        };

        return {
          pigs: pigsWithStatus,
          stats,
        };
      } catch (error) {
        throw new Error("Failed to fetch regional overview");
      }
    }),
});

export type AppRouter = typeof appRouter;
