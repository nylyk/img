import {
  init,
  compress as zstdCompress,
  decompress as zstdDecompress,
} from '@bokuweb/zstd-wasm';

let initialized = false;
init()
  .then(() => (initialized = true))
  .catch(console.error);

const waitUntilInitialized = async (): Promise<void> => {
  if (!initialized) {
    return new Promise((resolve) => {
      setInterval(() => {
        if (initialized) {
          resolve();
        }
      }, 25);
    });
  }
  return Promise.resolve();
};

export const compress = async (data: Uint8Array): Promise<Uint8Array> => {
  await waitUntilInitialized();

  return new Promise((resolve) => {
    const sizeBeforeCompression = data.byteLength;
    const compressed = zstdCompress(data, 7);
    resolve(compressed);
    console.log(
      'Compression ratio:',
      (compressed.byteLength / sizeBeforeCompression).toFixed(3)
    );
  });
};

export const decompress = async (data: Uint8Array): Promise<Uint8Array> => {
  await waitUntilInitialized();

  return new Promise((resolve) => {
    resolve(zstdDecompress(data));
  });
};
