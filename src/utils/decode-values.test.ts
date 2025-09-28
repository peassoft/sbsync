import { describe, test, it, expect } from 'vitest';

import {
  decodeUint64,
} from './decode-values.js';

describe('decodeUint64', () => {
  test('correct 1-byte value', () => {
    const value = 255;
    const buffer = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0xFF]).buffer;

    const result = decodeUint64(buffer, 0);

    expect(result).toBe(value);
  });

  test('correct 2-byte value', () => {
    const value = 258;
    const buffer = new Uint8Array([0, 0, 0, 0, 0, 0, 0x01, 0x02]).buffer;

    const result = decodeUint64(buffer, 0);

    expect(result).toBe(value);
  });

  test('correct 3-byte value', () => {
    const value = 65_794;
    const buffer = new Uint8Array([0, 0, 0, 0, 0, 0x01, 0x01, 0x02]).buffer;

    const result = decodeUint64(buffer, 0);

    expect(result).toBe(value);
  });

  test('correct 4-byte value', () => {
    const value = 16_843_010;
    const buffer = new Uint8Array([0, 0, 0, 0, 0x01, 0x01, 0x01, 0x02]).buffer;

    const result = decodeUint64(buffer, 0);

    expect(result).toBe(value);
  });

  test('correct 5-byte value', () => {
    const value = 4311810306;
    const buffer = new Uint8Array([0, 0, 0, 0x1, 0x01, 0x01, 0x01, 0x02]).buffer;

    const result = decodeUint64(buffer, 0);

    expect(result).toBe(value);
  });

  test('too big integer', () => {
    const buffer = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]).buffer;

    expect(() => decodeUint64(buffer, 0)).toThrowError('number exceeding max safe integer');
  });
});
