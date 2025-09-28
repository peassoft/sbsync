const textDecoder = new TextDecoder('utf-8', { fatal: true });

export function decodeUint64(buffer: ArrayBuffer, offset: number): number {
  const result = new DataView(buffer, offset, 4).getUint32(0, false) * 2 ** 32 +
    new DataView(buffer, offset + 4, 4).getUint32(0, false);

  if (result > Number.MAX_SAFE_INTEGER) {
    throw new Error('decoding an Uint64 value resulted in a number exceeding max safe integer');
  }

  return result;
}

export function decodeUint16(buffer: ArrayBuffer, offset: number): number {
  return new DataView(buffer, offset, 2).getUint16(0, false);
}

export function decodeString(buffer: ArrayBuffer, offset: number, length: number): string {
  return textDecoder.decode(new Uint8Array(buffer, offset, length));
}
