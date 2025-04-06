import { init, compress, decompress } from '@bokuweb/zstd-wasm';
import { Post } from './post';

init().catch(console.error);

export const compressPost = (post: Post): Uint8Array => {
  const encoded = new TextEncoder().encode(JSON.stringify(post));
  return compress(encoded, 9);
};

export const decompressPost = (data: Uint8Array): Post => {
  const decompressed = decompress(data);
  const decoded = new TextDecoder().decode(decompressed);
  return JSON.parse(decoded) as Post;
};
