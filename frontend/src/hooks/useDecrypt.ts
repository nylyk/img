import { useEffect, useState } from 'react';
import { deserializePost, Post } from '../utils/post';
import { decrypt } from '../utils/crypto';
import { decompress } from '../utils/compresssion';
import { sleep } from '../utils/utils';

type DecryptionState =
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
        await sleep(5); // sleep to let react update the state
        const decrypted = await decrypt(base64, password);
        if (ignore) {
          return;
        }

        setState('decompression');
        await sleep(5);
        const decompressed = await decompress(decrypted);
        if (ignore) {
          return;
        }

        setState('deserialization');
        await sleep(5);
        const deserialized = await deserializePost(decompressed);
        if (ignore) {
          return;
        }

        setState('done');
        setPost(deserialized);
      } catch (err) {
        console.error(err);
        setError('Error while decrypting post');
      }
    })();

    return () => {
      ignore = true;
    };
  }, [base64, password]);

  return [state, error, post];
};

export default useDecrypt;
