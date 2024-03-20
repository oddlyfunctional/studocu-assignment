import { clock, type Clock } from "@/lib/clock";
import { random, type Random } from "@/lib/random";

export type Env = {
  random: Random;
  clock: Clock;
};

export const loadEnv = (): Env => ({
  random,
  clock,
});
