"use server";
import * as Core from "@/domain/core";
import { loadEnv } from "@/env";

export const createQnA = async (params: {
  question: string;
  answer: string;
}) => {
  const { random, clock } = loadEnv();
  // TODO: persist data before returning
  return Core.createQnA(params, random, clock);
};
