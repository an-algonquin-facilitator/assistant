export const expires = (jwt: string) => {
  try {
    return (
      new Date(JSON.parse(atob(jwt.split(".")[1])).exp * 1000).getTime() -
      Date.now()
    );
  } catch (err) {
    return -1;
  }
};

export const secondsToMinutes = (d: number) => {
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  return `${m} minutes ${s} seconds`;
};

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};
