import isPlainObject from './utils/is-plain-object.js';

export function serialize(data: unknown, prevBinary?: ArrayBuffer): ArrayBuffer {
  if (!isPlainObject(data)) {
    throw new Error('sbsync: only a plain object as the root supported');
  }

  const buffers = {
    keysBuffer: new ArrayBuffer(1024 * 128), // 128 KB
    dataBuffer: new ArrayBuffer(1024 * 128), // 128 KB
  };

  let keysOffset = -1;
  let dataOffset = -1;

  function extendBuffer(bufferName: keyof typeof buffers): void {
    const buffer = buffers[bufferName];

    const currLen = buffer.byteLength;
    const newLen = currLen * 2;

    const currView = new Uint8Array(buffer);
    const newView = new Uint8Array(newLen);

    newView.set(currView, 0);

    buffers[bufferName] = newView.buffer;
  }

  function truncateBuffer(bufferName: keyof typeof buffers, currOffset: number): void {
    const buffer = buffers[bufferName];

    const currView = new Uint8Array(buffer, 0, currOffset + 1);
    const newView = new Uint8Array(currOffset + 1);

    newView.set(currView, 0);

    buffers[bufferName] = newView.buffer;
  }

  function serializeItem(item: unknown, key: string | null): void {
    if (key !== null) {

    }

    // Both null and undefined values are serialized to the null value
    if (item == null) {

    }
  }

  serializeItem(data, null);

  truncateBuffer('keysBuffer', keysOffset);
  truncateBuffer('dataBuffer', dataOffset);

  const resultingView =
    new Uint8Array(buffers.keysBuffer.byteLength + buffers.dataBuffer.byteLength);

  resultingView.set(new Uint8Array(buffers.keysBuffer, 0));
  resultingView.set(new Uint8Array(buffers.dataBuffer, buffers.keysBuffer.byteLength));

  return resultingView.buffer;
}
