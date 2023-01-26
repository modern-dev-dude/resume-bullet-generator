import { createTRPCRouter } from "./trpc";
import { openai } from "./routers/openai";
import { depatmentOfLabor } from "./routers/departmentoflabor";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  openai: openai,
  depatmentOfLabor: depatmentOfLabor,
});

// export type definition of API
export type AppRouter = typeof appRouter;
