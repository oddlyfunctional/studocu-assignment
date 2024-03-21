"use server";
import * as Core from "@/domain/core";
import * as QnARepository from "@/domain/qnaRepository";
import { loadEnv, loadEnvWithoutPersistence } from "@/env";
import { ok, type Result } from "@/lib/result";
import crypto from "crypto";

export const getAllQnAs = async () => {
  if (process.env.USE_PERSISTENCE) {
    const { db } = await loadEnv();
    const repository = QnARepository.make(db);
    const qnas = await repository.getAll();
    if (!qnas.ok) throw qnas.error; // unexpected error
    return qnas.value;
  } else {
    return [];
  }
};

export const createQnA = async (params: {
  question: string;
  answer: string;
}): Promise<Result<Core.QnA, Core.QnAValidationErrors>> => {
  if (process.env.USE_PERSISTENCE) {
    const { clock, db } = await loadEnv();
    const qna = Core.createQnA(params, clock);
    if (!qna.ok) return qna;
    const repository = QnARepository.make(db);
    const id = await repository.create(qna.value);
    if (!id.ok) throw id.error; // unexpected error
    return ok({
      ...qna.value,
      id: id.value,
    });
  } else {
    const { clock } = await loadEnvWithoutPersistence();
    const qna = Core.createQnA(params, clock);
    if (!qna.ok) return qna;
    const id = crypto.randomInt(999_999_999) as Core.QnAId;
    return ok({
      ...qna.value,
      id,
    });
  }
};

export const updateQnA = async (
  qna: Core.QnA,
  params: {
    question: string;
    answer: string;
  }
): Promise<Result<Core.QnA, Core.QnAValidationErrors>> => {
  if (process.env.USE_PERSISTENCE) {
    const updated = Core.updateQnA(qna, params);
    if (!updated.ok) return updated;
    const { clock, db } = await loadEnv();
    const repository = QnARepository.make(db);
    const result = await repository.update(updated.value);
    if (!result.ok) throw result.error; // unexpected error
    return ok({ ...qna, ...updated.value });
  } else {
    const updated = Core.updateQnA(qna, params);
    if (!updated.ok) return updated;
    return ok({ ...qna, ...updated.value });
  }
};

export const deleteQnA = async (id: Core.QnAId) => {
  if (process.env.USE_PERSISTENCE) {
    const { db } = await loadEnv();
    const repository = QnARepository.make(db);
    const result = await repository.delete(id);
    if (!result.ok) throw result.error;
  }
};

export const deleteAllQnAs = async () => {
  if (process.env.USE_PERSISTENCE) {
    const { db } = await loadEnv();
    const repository = QnARepository.make(db);
    const result = await repository.deleteAll();
    if (!result.ok) throw result.error;
  }
};
