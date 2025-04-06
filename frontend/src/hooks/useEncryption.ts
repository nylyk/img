import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { Post } from '../utils/post';
import { encrypt } from '../utils/crypto';
import { compressPost } from '../utils/compresssion';

// number = size after encryption is done in bytes
type EncryptionState = 'idle' | 'compression' | 'encryption' | number;

type Error = string | undefined;
type Password = string | undefined;
type CipherText = string | undefined;

const useEncryption = (
  post: Post | undefined
): [EncryptionState, Error, Password, CipherText] => {
  const debouncedPost = useDebounce(post, 750);

  const [state, setState] = useState<EncryptionState>('idle');
  const [error, setError] = useState<string>();

  const [compressedPost, setCompressedPost] = useState<Uint8Array>();
  const [password, setPassword] = useState<Password>();
  const [cipherText, setCipherText] = useState<CipherText>();

  useEffect(() => {
    setState('idle');
    setError(undefined);
    setCompressedPost(undefined);
    setPassword(undefined);
    setCipherText(undefined);
  }, [post]);

  useEffect(() => {
    if (debouncedPost) {
      setState('compression');
      setTimeout(() => {
        setCompressedPost(compressPost(debouncedPost));
      }, 1);
    }
  }, [debouncedPost]);

  useEffect(() => {
    if (compressedPost) {
      setState('encryption');
      encrypt(compressedPost)
        .then(([password, cipher]) => {
          setPassword(password);
          setCipherText(cipher);
          setState(cipher.length);
        })
        .catch((err) => {
          console.error(err);
          setError('Error encrypting');
        });
    }
  }, [compressedPost]);

  return [state, error, password, cipherText];
};

export default useEncryption;
