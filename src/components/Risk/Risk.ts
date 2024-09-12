const localStorageKey = "DO_NOT_WARN";

export const SetDoNotWarn = (doNotWarn: boolean): void => {
  localStorage.setItem(localStorageKey, doNotWarn + "");
};

export const ShouldWarn = (): boolean => {
  // localstorage value will either be `null`, `"false"`, or `"true"`
  return localStorage.getItem(localStorageKey) !== "true";
};
