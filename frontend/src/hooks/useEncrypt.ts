import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { Post, serializePost } from '../utils/post';
import { encrypt } from '../utils/crypto';
import { compress } from '../utils/compression';
import { sleep } from '../utils/utils';
import { EncryptionError, SerializationError } from '../utils/errors';

// number = size after encryption is done in bytes
export type EncryptionState =
  | 'serialization'
  | 'compression'
  | 'encryption'
  | number
  | undefined;
type Error = string | undefined;
type CipherText = string | undefined;
type Password = string | undefined;

const useEncrypt = (
  post: Post | undefined
): [EncryptionState, Error, CipherText, Password] => {
  const debouncedPost = useDebounce(post, 250);

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
          await sleep(10); // sleep to let react update the state
          const serialized = await serializePost(debouncedPost);
          if (ignore) {
            return;
          }

          setState('compression');
          await sleep(10);
          const compressed = await compress(serialized);
          if (ignore) {
            return;
          }

          setState('encryption');
          await sleep(10);
          const [password, cipherText, size] = await encrypt(compressed);
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
