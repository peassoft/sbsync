import {
  decodeUint64,
  decodeUint16,
  decodeString,
} from './utils/decode-values.js';
import { META_LEN_BYTES } from './constants.js';

export default function restoreKeysDictionary(binary: ArrayBuffer): Map<string, [number, false]> {
  let currOffset = META_LEN_BYTES;

  let keysDictionaryLen: number;

  try {
    keysDictionaryLen = decodeUint64(binary, 10);
  } catch (err) {
    throw new Error(
      'previous binary corrupted - invalid value of keys dictionary length',
      { cause: err },
    );
  }

  const finalOffset = currOffset + keysDictionaryLen - 1;

  const dict = new Map<string, [number, false]>();

  while (currOffset < finalOffset) {
    let id: number;
    let keyName: string;

    try {
      id = decodeUint64(binary, currOffset);
    } catch (err) {
      throw new Error(
        'previous binary corrupted - invalid value of key ID',
        { cause: err },
      );
    }

    const len = decodeUint16(binary, currOffset + 8);

    try {
      keyName = decodeString(binary, currOffset + 10, len);
    } catch (err) {
      throw new Error(
        `previous binary corrupted - invalid value of key name for keyID = ${id}`,
        { cause: err },
      );
    }

    dict.set(keyName, [id, false]);

    currOffset += 8 + 2 + len + 2;
  }

  return dict;
}
