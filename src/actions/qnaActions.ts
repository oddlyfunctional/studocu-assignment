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

export const updateQnA = async (
  qna: Core.QnA,
  params: {
    question: string;
    answer: string;
  }
) => {
  // TODO: persist data before returning
  return Core.updateQnA(qna, params);
};
