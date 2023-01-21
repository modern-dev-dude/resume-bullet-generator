import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import {serverEnv} from '../../../env/schema.mjs';
import { createTRPCRouter, publicProcedurE } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getBullet: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/say-hello' } })
    .input(z.object({ text: z.string() }))
    .output(z.object({ aiResponse: z.array(z.any()), itWorked: z.boolean() }))
    .query(async ({ input }) => {
      const responseFromOpenAi = await getResponse(input.text);
      return {
        aiResponse: responseFromOpenAi,
        itWorked: true
      }
    }), 
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

});

// function that gets a response from openai to the question
export const getResponse = async (question: string) => {
  const configuration = new Configuration({
    apiKey: serverEnv.OPEN_AI_API_KEY,
    organization: serverEnv.OPEN_AI_ORG_ID,
  });
  const openai = new OpenAIApi(configuration);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const resposne = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    n: 3,
    max_tokens:100,
    temperature: 0.9,
  });
  return  resposne?.data?.choices ?? ['No response'];
};
//https://api.openai.com/v1/completions \

// const configuration = new Configuration({
//     organization: "org-EDb0uJiGycksj3HgOTkVTAyN",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();