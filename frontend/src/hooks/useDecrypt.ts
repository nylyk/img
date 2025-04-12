import { useEffect, useState } from 'react';
import { deserializePost, Post } from '../utils/post';
import { decrypt } from '../utils/crypto';
import { decompress } from '../utils/compression';
import { sleep } from '../utils/utils';
import { EncryptionError, SerializationError } from '../utils/errors';

export type DecryptionState =
  | 'decryption'
  | 'decompression'
  | 'deserialization'
  | 'done'
  | undefined;
type Error = string | undefined;

const useDecrypt = (
  base64: string | undefined,
  password: string | undefined
): [DecryptionState, Error, Post | undefined] => {
  const [state, setState] = useState<DecryptionState>();
  const [error, setError] = useState<string>();

  const [post, setPost] = useState<Post>();

  useEffect(() => {
    setError(undefined);
    setPost(undefined);
    if (!base64 || !password) {
      setState(undefined);
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setState('decryption');
        await sleep(10); // sleep to let react update the state
        const decrypted = await decrypt(base64, password);
        if (ignore) {
          return;
        }

        setState('decompression');
        await sleep(10);
        const decompressed = await decompress(decrypted);
        if (ignore) {
          return;
        }

        setState('deserialization');
        await sleep(10);
        const deserialized = deserializePost(decompressed);
        if (ignore) {
          return;
        }

        setState('done');
        setPost(deserialized);
      } catch (error) {
        if (error instanceof SerializationError) {
          setError('An error occurred while deserializing the post');
        } else if (error instanceof EncryptionError) {
          setError('An error occurred while decrypting the post');
        } else {
          console.error(error);
          setError('An error occurred');
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [base64, password]);

  return [state, error, post];
};

export default useDecrypt;
