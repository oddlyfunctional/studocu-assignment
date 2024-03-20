export type Clock = {
  now: () => Date;
};

export const mockClock = () => {
  let now: Date | null = null;

  const setNow = (date: Date) => {
    now = date;
  };

  const clock: Clock = {
    now: () => {
      if (!now) throw new Error("Mock now not initialized");
      return now;
    },
  };

  return {
    setNow,
    clock,
  };
};
