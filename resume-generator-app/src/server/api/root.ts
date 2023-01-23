import { createTRPCRouter } from "./trpc";
import { openai } from "./routers/openai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  openai: openai,
});

// export type definition of API
export type AppRouter = typeof appRouter;
