import type { Uuid } from "@/domain/core";

export type Random = {
  nextUuid: () => Uuid;
};

export const mockRandom = () => {
  let nextUuid: Uuid | null = null;

  const setNextUuid = (uuid: Uuid) => {
    nextUuid = uuid;
  };

  const random: Random = {
    nextUuid: () => {
      if (!nextUuid) throw new Error("Mock nextUuid not initialized");
      return nextUuid;
    },
  };

  return {
    setNextUuid,
    random,
  };
};
