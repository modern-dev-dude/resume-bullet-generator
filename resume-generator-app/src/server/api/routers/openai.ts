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

export const openai = createTRPCRouter({
  getBullet: publicProcedure
    .input(z.object({ text: z.string() }))
    .output(z.array(ZodOpenAICompletionResponse))
    .mutation(async ({ input }) => {
      const responseFromOpenAi = await getResponse(input.text);
      return responseFromOpenAi;
    }),
});

// function that gets a response from openai to the question
export const getResponse = async (question: string) => {
  const configuration = new Configuration({
    apiKey: serverEnv.OPEN_AI_API_KEY,
    organization: serverEnv.OPEN_AI_ORG_ID,
  });

  const openai = new OpenAIApi(configuration);
  const resposne = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Create a resume bullet for ${question}`,
    n: 3,
    max_tokens: 100,
    temperature: 0.9,
  });

  return (
    resposne?.data?.choices ?? [
      { text: "No response", index: 0, finish_reason: "No response" },
    ]
  );
};
