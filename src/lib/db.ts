import { error, ok, type Result } from "@/lib/result";
import { Client } from "pg";
import type { SQLStatement } from "sql-template-strings";
import { z, ZodType } from "zod";

export type Db = {
  query: <T>(
    statement: SQLStatement,
    schema: ZodType<T>
  ) => Promise<Result<T[], unknown>>;
  mutate: <T>(statement: SQLStatement) => Promise<Result<void, unknown>>;
  close: () => Promise<void>;
};

export const makePg = (client: Client): Db => ({
  query: async (statement, schema) => {
    try {
      const result = await client.query(statement);
      const rows = z.array(schema).safeParse(result.rows);
      if (rows.success) {
        return ok(rows.data);
      } else {
        console.error("Failed to decode:", rows.error);
        return error(rows.error);
      }
    } catch (e) {
      console.error("Unexpected error", e);
      return error(e);
    }
  },
  mutate: async (statement) => {
    try {
      const result = await client.query(statement);
      return ok(undefined);
    } catch (e) {
      console.error("Unexpected error", e);
      return error(e);
    }
  },
  close: () => client.end(),
});
