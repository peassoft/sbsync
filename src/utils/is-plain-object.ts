export default function isPlainObject(data: unknown): data is Record<string, unknown> {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const prototype: unknown = Object.getPrototypeOf(data);

  return (
    prototype === null ||
    prototype === Object.prototype ||
    Object.getPrototypeOf(prototype) === null
  ) &&
  !(Symbol.toStringTag in data) &&
  !(Symbol.iterator in data);
}
