const pipeThrough = async (
  data: Uint8Array,
  stream: ReadableWritablePair<unknown, Uint8Array<ArrayBufferLike>>
): Promise<Uint8Array> => {
  const blob = new Blob([data]);
  const buffer = await new Response(
    blob.stream().pipeThrough(stream)
  ).arrayBuffer();
  return new Uint8Array(buffer);
};

export const compress = async (data: Uint8Array): Promise<Uint8Array> => {
  const compressed = await pipeThrough(data, new CompressionStream('gzip'));
  console.log(
    'Compression ratio:',
    (compressed.byteLength / data.byteLength).toFixed(3)
  );
  return compressed;
};

export const decompress = (data: Uint8Array): Promise<Uint8Array> => {
  return pipeThrough(data, new DecompressionStream('gzip'));
};
