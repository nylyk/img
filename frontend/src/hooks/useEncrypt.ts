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
type Cipher = Uint8Array | undefined;
type Password = string | undefined;

const useEncrypt = (
  post: Post | undefined,
): [EncryptionState, Error, Cipher, Password] => {
  const debouncedPost = useDebounce(post, 500);

  const [state, setState] = useState<EncryptionState>();
  const [error, setError] = useState<string>();

  const [password, setPassword] = useState<Password>();
  const [cipher, setCipher] = useState<Cipher>();

  useEffect(() => {
    setState(undefined);
    setError(undefined);
    setPassword(undefined);
    setCipher(undefined);
  }, [post]);

  useEffect(() => {
    let ignore = false;

    if (debouncedPost) {
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
          const [cipher, password] = await encrypt(serialized);
          if (ignore) {
            return;
          }

          setState(cipher.byteLength);
          setCipher(cipher);
          setPassword(password);
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
  }, [debouncedPost]);

  return [state, error, cipher, password];
};

export default useEncrypt;
