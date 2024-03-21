import type {
  NonEmptyString,
  QnA,
  QnAId,
  QnARepository as Repository,
} from "@/domain/core";
import type { Db } from "@/lib/db";
import { error, ok } from "@/lib/result";
import SQL from "sql-template-strings";
import { z } from "zod";

export const make = (db: Db): Repository => ({
  getAll: async () => {
    const rows = await db.query(
      SQL`
    SELECT
        id,
        question,
        answer,
        created_at AS "createdAt"
    FROM qnas
    `,
      z.object({
        id: z.number(),
        question: z.string(),
        answer: z.string(),
        createdAt: z.date(),
      })
    );

    if (!rows.ok) return rows;
    return ok(
      rows.value.map(
        (row): QnA => ({
          id: row.id as QnAId,
          // All data from the db should be valid so there's no
          // need to revalidate each individual field.
          question: row.question as NonEmptyString,
          answer: row.answer as NonEmptyString,
          createdAt: row.createdAt,
        })
      )
    );
  },
  create: async (qna) => {
    const rows = await db.query(
      SQL`
    INSERT INTO qnas (
        question,
        answer,
        created_at
    ) VALUES (
        ${qna.question},
        ${qna.answer},
        ${qna.createdAt}
    ) RETURNING id
    `,
      z.object({ id: z.number() })
    );

    if (!rows.ok) return rows;
    if (rows.value.length === 0) return error("No rows were inserted");
    return ok(rows.value[0].id as QnAId);
  },
  update: (qna) =>
    db.mutate(
      SQL`
    UPDATE qnas SET
        question = ${qna.question},
        answer = ${qna.answer}
    WHERE
        id = ${qna.id}
        `
    ),
  delete: (id) => db.mutate(SQL`DELETE FROM qnas WHERE id = ${id}`),
  deleteAll: () => db.mutate(SQL`DELETE FROM qnas`),
});
