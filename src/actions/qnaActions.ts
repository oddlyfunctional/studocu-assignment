"use server";
import * as Core from "@/domain/core";
import * as QnARepository from "@/domain/qnaRepository";
import { loadEnv } from "@/env";
import { ok, type Result } from "@/lib/result";

export const getAllQnAs = async () => {
  const { db } = await loadEnv();
  const repository = QnARepository.make(db);
  const qnas = await repository.getAll();
  if (!qnas.ok) throw qnas.error; // unexpected error
  return qnas.value;
};

export const createQnA = async (params: {
  question: string;
  answer: string;
}): Promise<Result<Core.QnA, Core.QnAValidationErrors>> => {
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
};

export const updateQnA = async (
  qna: Core.QnA,
  params: {
    question: string;
    answer: string;
  }
): Promise<Result<Core.QnA, Core.QnAValidationErrors>> => {
  const updated = Core.updateQnA(qna, params);
  if (!updated.ok) return updated;
  const { clock, db } = await loadEnv();
  const repository = QnARepository.make(db);
  const result = await repository.update(updated.value);
  if (!result.ok) throw result.error; // unexpected error
  return ok({ ...qna, ...updated.value });
};

export const deleteQnA = async (id: Core.QnAId) => {
  const { db } = await loadEnv();
  const repository = QnARepository.make(db);
  const result = await repository.delete(id);
  if (!result.ok) throw result.error;
};

export const deleteAllQnAs = async () => {
  const { db } = await loadEnv();
  const repository = QnARepository.make(db);
  const result = await repository.deleteAll();
  if (!result.ok) throw result.error;
};
