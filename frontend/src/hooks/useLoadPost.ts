import { useEffect, useState } from 'react';

import { decrypt } from '@/utils/crypto';
import { EncryptionError, SerializationError } from '@/utils/errors';
import { deserializePost, Post } from '@/utils/post';
import { sleep } from '@/utils/utils';

export type LoadState = 'download' | 'decryption' | 'deserialization';

interface LoadedPost {
  state: LoadState;
  progress: number;
  notFound: boolean;
  error: string | undefined;
  expiresAt: number | undefined;
  post: Post | undefined;
}

const useLoadPost = (id: string, password: string): LoadedPost => {
  const [state, setState] = useState<LoadState>('download');
  const [progress, setProgress] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string>();
  const [expiresAt, setExpiresAt] = useState<number>();
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    setState('download');
    setProgress(0);
    setNotFound(false);
    setError(undefined);
    setExpiresAt(undefined);
    setPost(undefined);

    let ignore = false;
    let deserialized: Post | undefined;
    const revokeUrls = () =>
      deserialized?.files.forEach((file) => URL.revokeObjectURL(file.url));

    const decryptPost = async (data: Uint8Array<ArrayBuffer>) => {
      try {
        setState('decryption');
        await sleep(15); // sleep to let react update the state
        const decrypted = await decrypt(data, password);
        if (ignore) {
          return;
        }

        setState('deserialization');
        await sleep(15);
        deserialized = deserializePost(decrypted);
        if (ignore) {
          revokeUrls();
          return;
        }

        setPost(deserialized);
      } catch (error) {
        if (ignore) {
          return;
        }
        if (error instanceof SerializationError) {
          setError('An error occurred while deserializing');
        } else if (error instanceof EncryptionError) {
          setError('An error occurred while decrypting');
        } else {
          console.error(error);
          setError('An error occurred');
        }
      }
    };

    let request: XMLHttpRequest | undefined = new XMLHttpRequest();
    request.open('GET', `/api/post/${id}`, true);
    request.responseType = 'arraybuffer';

    let lastProgressUpdate = 0;
    request.onprogress = (event) => {
      const now = Date.now();
      if (event.lengthComputable && now - lastProgressUpdate > 100) {
        setProgress(event.loaded / event.total);
        lastProgressUpdate = now;
      }
    };

    request.onerror = (event) => {
      console.error(event);
      setError('Error while fetching data');
    };

    request.onload = () => {
      const response = request!;
      request = undefined;

      if (response.status === 404) {
        return setNotFound(true);
      }
      const expiresAtHeader = response.getResponseHeader('img-expires-at');
      if (response.status !== 200 || !expiresAtHeader) {
        return setError('Error while fetching data');
      }

      setExpiresAt(new Date(expiresAtHeader).getTime());
      decryptPost(new Uint8Array(response.response));
    };

    request.send();

    return () => {
      ignore = true;
      request?.abort();
      revokeUrls();
    };
  }, [id, password]);

  return { state, progress, notFound, error, expiresAt, post };
};

export default useLoadPost;
