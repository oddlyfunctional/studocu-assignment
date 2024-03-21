import { clock, type Clock } from "@/lib/clock";
import { makePg, type Db } from "@/lib/db";
import { Client } from "pg";

export type Env = {
  clock: Clock;
  db: Db;
};

declare global {
  var env: Env | undefined;
}

const gracefulShutdown = () => {
  globalThis.env?.db?.close();
  delete globalThis.env;
};

export const loadEnv = async () => {
  if (globalThis.env === undefined) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL not found");
    const client = new Client({ connectionString });
    await client.connect();

    globalThis.env = {
      clock,
      db: makePg(client),
    };

    if (process.env.NEXT_MANUAL_SIG_HANDLE) {
      process.on("SIGTERM", () => {
        console.log("Shutting down...");
        gracefulShutdown();
        process.exit(0);
      });
      process.on("SIGINT", () => {
        console.log("Shutting down...");
        gracefulShutdown();
        process.exit(0);
      });
    }
  }
  return globalThis.env;
};
