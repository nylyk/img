import { FC, useEffect, useState } from 'react';
import useIdAndPassword from '../hooks/useIdAndPassword';
import useDecrypt from '../hooks/useDecrypt';
import useFetch from '../hooks/useFetch';
import { api } from 'common';

const Viewer: FC = () => {
  const [error, setError] = useState<string>();

  const [id, password] = useIdAndPassword();
  const [fetchResponse, fetchError] = useFetch<api.Post>(`/api/post/${id}`);
  const [data, setData] = useState<string>();
  const [state, decryptionError, post] = useDecrypt(data, password);

  useEffect(() => {
    if (fetchResponse && !fetchError) {
      setData(fetchResponse.data);
    }
  }, [fetchResponse, fetchError]);

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
      {post &&
        post.images.map((image, i) => (
          <img src={image.dataUrl} key={i + image.dataUrl.slice(-10)} />
        ))}
    </>
  );
};

export default Viewer;
