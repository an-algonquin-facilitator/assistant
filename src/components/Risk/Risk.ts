export const localStorageDoNotWarnKey = "DO_NOT_WARN";

export const SetDoNotWarn = (doNotWarn: boolean): void => {
  localStorage.setItem(localStorageDoNotWarnKey, doNotWarn + "");
};

export const ShouldWarn = (): boolean => {
  // localstorage value will either be `null`, `"false"`, or `"true"`
  return localStorage.getItem(localStorageDoNotWarnKey) !== "true";
};
