import { useEffect, useState } from 'react';
import { Post } from '../utils/post';
import { api } from 'common';
import useFetch from './useFetch';
import { decrypt } from '../utils/crypto';
import { decompressPost } from '../utils/compresssion';

type DecryptionState = 'fetch' | 'decypt' | 'decompress';
type Error = string | undefined;

const useFetchAndDecrypt = (
  id: string,
  password: string
): [DecryptionState, Error, Post | undefined] => {
  const [state, setState] = useState<DecryptionState>('fetch');
  const [error, setError] = useState<string>();

  const [postData, fetchError] = useFetch<api.Post>(`/api/post/${id}`);
  const [decrypted, setDecrypted] = useState<Uint8Array>();
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    if (fetchError) {
      setError('Error while loding post');
    }
  }, [fetchError]);

  useEffect(() => {
    setState('fetch');
    setError(undefined);
    setDecrypted(undefined);
    setPost(undefined);
  }, [id, password]);

  useEffect(() => {
    if (postData && password) {
      setState('decypt');
      decrypt(postData.data, password)
        .then(setDecrypted)
        .catch((err) => {
          console.error(err);
          setError('Error while decrypting post');
        });
    }
  }, [postData, password]);

  useEffect(() => {
    if (decrypted) {
      setState('decompress');
      setTimeout(() => {
        setPost(decompressPost(decrypted));
      }, 1);
    }
  }, [decrypted]);

  return [state, error, post];
};

export default useFetchAndDecrypt;
