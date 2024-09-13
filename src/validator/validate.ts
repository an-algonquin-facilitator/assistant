export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  property: RequireLiteral<K>,
): obj is T & { [P in K]: { [Q in P]: unknown } }[K];
export function hasProperty(obj: unknown, property: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

type RequireLiteral<K extends PropertyKey> = string extends K
  ? never
  : number extends K
    ? never
    : symbol extends K
      ? never
      : K;

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object";

export const extraKeys = (
  v: Record<string, unknown>,
  keys: PropertyKey[],
): string[] => {
  const props = Object.getOwnPropertyNames(v);
  return props.filter((p) => !keys.includes(p));
};

export const isArray = (v: unknown): v is unknown[] =>
  v != null && Array.isArray(v);
