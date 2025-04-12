import { FC, useEffect, useState } from 'react';
import useDecrypt from '../hooks/useDecrypt';
import useFetch from '../hooks/useFetch';
import { api } from 'common';
import { useDocumentTitle } from '@uidotdev/usehooks';
import { DefaultParams } from 'wouter';

const Viewer: FC<{ params: DefaultParams }> = ({ params: { id } }) => {
  const password = location.hash.substring(1);

  const [error, setError] = useState<string>();
  const [fetchResponse, fetchError] = useFetch<api.Post>(`/api/post/${id}`);
  const [state, decryptionError, post] = useDecrypt(
    fetchResponse?.data,
    password
  );

  useDocumentTitle(post ? `${post.title} - img` : 'img');

  useEffect(() => {
    if (fetchError) {
      setError('Error while fetching post');
    }
  }, [fetchError]);

  useEffect(() => {
    if (decryptionError) {
      setError(decryptionError);
    }
  }, [decryptionError]);

  return (
    <>
      <h1>
        Viewer {id} {password}
      </h1>
      <span>{state}</span>
      {post && <h2 className="text-3xl">{post.title}</h2>}
      {post &&
        post.files.map((file) => {
          if (file.blob.type.startsWith('image')) {
            return <img src={file.url} key={file.url} />;
          } else if (file.blob.type.startsWith('video')) {
            return <video src={file.url} key={file.url} controls />;
          }
        })}
    </>
  );
};

export default Viewer;
