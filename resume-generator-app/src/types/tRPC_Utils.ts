/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";
import type { RouterOutputs } from "../utils/api";

/**
 * utility class to get the type of a zod schema from third party library
 */
export const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) =>
    arg;
export type GetResumeBulletResponse = RouterOutputs["openai"]["getBullet"];
