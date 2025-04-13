import { useCallback, useEffect, useState } from 'react';
import { Post } from '../utils/post';
import { api } from 'common';

const useUpload = (
  expiresInSeconds: number | undefined,
  data: string | undefined
): [number | undefined, string | undefined, boolean, () => void] => {
  const [request, setRequest] = useState<XMLHttpRequest>();

  const [error, setError] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [id, setId] = useState<string>();

  useEffect(() => {
    setError(false);
    setProgress(undefined);
    setId(undefined);
  }, [expiresInSeconds, data]);

  useEffect(() => {
    const onProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      if (event.lengthComputable) {
        setProgress(event.loaded / event.total);
      }
    };

    const onLoadEnd = () => {
      if (
        request &&
        (request.readyState === request.DONE || request.status === 200)
      ) {
        const response: api.CreatePost = JSON.parse(request.responseText);
        setId(response.id);
      } else {
        setError(true);
      }
    };

    request?.upload.addEventListener('progress', onProgress);
    request?.addEventListener('loadend', onLoadEnd);

    request?.open('POST', '/api/post', true);
    request?.setRequestHeader('Content-Type', 'application/json');
    request?.send(JSON.stringify({ expiresInSeconds, data }));

    return () => {
      request?.upload.removeEventListener('progress', onProgress);
      request?.removeEventListener('loadend', onLoadEnd);
      request?.abort();
    };
  }, [request]);

  const upload = useCallback(() => {
    if (expiresInSeconds && data) {
      setRequest(new XMLHttpRequest());
    }
  }, [expiresInSeconds, data]);

  return [progress, id, error, upload];
};

export default useUpload;
