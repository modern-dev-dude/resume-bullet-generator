import { z } from "zod";
import type { CreateCompletionResponseChoicesInner } from "openai";
import { Configuration, OpenAIApi } from "openai";
import { serverEnv } from "../../../env/schema.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { schemaForType } from "../../../types/tRPC_Utils";

const ZodOpenAICompletionResponse =
  schemaForType<CreateCompletionResponseChoicesInner>()(
    z.object({
      text: z.string().optional(),
      index: z.number().optional(),
      finish_reason: z.string().optional(),
    })
  );

export const depatmentOfLabor = createTRPCRouter({
  getBullet: publicProcedure.output(z.array(z.string())).query(() => {
    return [];
  }),
});
