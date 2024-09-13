const msPerSecond = 1000;
const msPerMinutes = 60000;
const msPerHour = 3600000;

export const tokenExpiryDateUnix = (jwt: string): number => {
  try {
    return (
      new Date(
        JSON.parse(atob(jwt.split(".")[1])).exp * msPerSecond,
      ).getTime() - Date.now()
    );
  } catch {
    return -1;
  }
};

export const secondsToMinutes = (d: number): string => {
  const m = Math.floor((d % msPerHour) / msPerMinutes);
  const s = Math.floor((d % msPerMinutes) / msPerSecond);
  return `${m} minutes ${s} seconds`;
};

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};
