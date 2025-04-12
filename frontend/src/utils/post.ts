import { SerializationError } from './errors';

export interface MediaFile {
  description: string;
  blob: Blob;
  url: string;
}

export interface Post {
  title: string;
  files: MediaFile[];
}

/*
  -- Binary format --
  
  |   Header   |
  |   File 1  |
  |   File 2  |
  |    ...     |

  Header:
   - 16-bit uint: number of files
   - 16-bit uint: title length
   - string: title

  Per file:
   - 16-bit uint: description length
   - 16-bit uint: data type length
   - 32-bit uint: data length
   - string: description
   - string: data type
   - binary data

  all strings are UTF-8
*/

export const serializePost = async (post: Post): Promise<Uint8Array> => {
  try {
    const encoder = new TextEncoder();

    const titleEncoded = encoder.encode(post.title);
    const headerLength = 4 + titleEncoded.byteLength;

    const descriptionsEncoded = post.files.map((f) =>
      encoder.encode(f.description)
    );
    const typesEncoded = post.files.map((f) => encoder.encode(f.blob.type));
    const buffers = (
      await Promise.all(post.files.map((f) => f.blob.arrayBuffer()))
    ).map((b) => new Uint8Array(b));
    const filesLength = post.files.reduce((length, _, i) => {
      return (
        length +
        8 +
        descriptionsEncoded[i].byteLength +
        typesEncoded[i].byteLength +
        buffers[i].byteLength
      );
    }, 0);

    const data = new Uint8Array(headerLength + filesLength);
    const dataView = new DataView(data.buffer);
    let offset = 0;

    dataView.setUint16(offset, post.files.length);
    offset += 2;

    dataView.setUint16(offset, titleEncoded.byteLength);
    offset += 2;
    data.set(titleEncoded, offset);
    offset += titleEncoded.byteLength;

    post.files.forEach((_, i) => {
      const descriptionEncoded = descriptionsEncoded[i];
      const typeEncoded = typesEncoded[i];
      const buffer = buffers[i];

      dataView.setUint16(offset, descriptionEncoded.byteLength);
      offset += 2;
      dataView.setUint16(offset, typeEncoded.byteLength);
      offset += 2;
      dataView.setUint32(offset, buffer.byteLength);
      offset += 4;

      data.set(descriptionEncoded, offset);
      offset += descriptionEncoded.byteLength;
      data.set(typeEncoded, offset);
      offset += typeEncoded.byteLength;
      data.set(buffer, offset);
      offset += buffer.byteLength;
    });

    return data;
  } catch (e) {
    console.error('Serialization error: ', e);
    throw new SerializationError();
  }
};

export const deserializePost = (data: Uint8Array): Post => {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const dataView = new DataView(data.buffer);
    let offset = 0;

    if (data.length < offset + 4) {
      throw new SerializationError('Post data is too short');
    }
    const numberOfFiles = dataView.getUint16(offset);
    offset += 2;
    const titleLength = dataView.getUint16(offset);
    offset += 2;

    if (data.length < offset + titleLength) {
      throw new SerializationError('Post data is too short');
    }
    const title = decoder.decode(data.subarray(offset, offset + titleLength));
    offset += titleLength;

    const files: MediaFile[] = [];
    for (let i = 0; i < numberOfFiles; i++) {
      if (data.length < offset + 8) {
        throw new SerializationError('Post data is too short');
      }
      const descriptionLength = dataView.getUint16(offset);
      offset += 2;
      const typeLength = dataView.getUint16(offset);
      offset += 2;
      const dataLength = dataView.getUint32(offset);
      offset += 4;

      const minLength = offset + descriptionLength + typeLength + dataLength;
      if (data.length < minLength) {
        throw new SerializationError('Post data is too short');
      }

      const description = decoder.decode(
        data.subarray(offset, offset + descriptionLength)
      );
      offset += descriptionLength;
      const type = decoder.decode(data.subarray(offset, offset + typeLength));
      offset += typeLength;
      const blob = new Blob([data.subarray(offset, offset + dataLength)], {
        type,
      });
      offset += dataLength;

      files.push({
        description,
        blob,
        url: URL.createObjectURL(blob),
      });
    }

    if (data.length !== offset) {
      throw new SerializationError('Post data is too long');
    }

    return {
      title,
      files,
    };
  } catch (e) {
    if (e instanceof SerializationError) {
      throw e;
    }
    console.error('Deserialization error: ', e);
    throw new SerializationError();
  }
};
