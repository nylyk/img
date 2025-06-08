import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

import { encrypt } from '@/utils/crypto';
import { EncryptionError, SerializationError } from '@/utils/errors';
import { Post, serializePost } from '@/utils/post';
import { sleep } from '@/utils/utils';

// number = size after encryption is done in bytes
export type EncryptionState =
  | 'serialization'
  | 'encryption'
  | number
  | undefined;
type Error = string | undefined;
type CipherText = string | undefined;
type Password = string | undefined;

const useEncrypt = (
  post: Post | undefined,
): [EncryptionState, Error, CipherText, Password] => {
  const debouncedPost = useDebounce(post, 500);

  const [state, setState] = useState<EncryptionState>();
  const [error, setError] = useState<string>();

  const [password, setPassword] = useState<Password>();
  const [cipherText, setCipherText] = useState<CipherText>();

  useEffect(() => {
    setState(undefined);
    setError(undefined);
    setPassword(undefined);
    setCipherText(undefined);
  }, [post]);

  useEffect(() => {
    let ignore = false;

    // only run if debouncedPost was updated, not post
    if (post && post === debouncedPost) {
      (async () => {
        try {
          setState('serialization');
          await sleep(15); // sleep to let react update the state
          const serialized = await serializePost(debouncedPost);
          if (ignore) {
            return;
          }

          setState('encryption');
          await sleep(15);
          const [password, cipherText, size] = await encrypt(serialized);
          if (ignore) {
            return;
          }

          setState(size);
          setPassword(password);
          setCipherText(cipherText);
        } catch (error) {
          if (error instanceof SerializationError) {
            setError('Serialization error');
          } else if (error instanceof EncryptionError) {
            setError('Encryption error');
          } else {
            console.error(error);
            setError('An error occurred');
          }
        }
      })();
    }

    return () => {
      ignore = true;
    };
  }, [post, debouncedPost]);

  return [state, error, cipherText, password];
};

export default useEncrypt;
