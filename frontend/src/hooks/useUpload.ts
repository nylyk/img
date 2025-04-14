import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from 'common';

const useUpload = (
  expiresInSeconds: number | undefined,
  data: string | undefined
): [number | undefined, string | undefined, boolean, () => void] => {
  const [request, setRequest] = useState<XMLHttpRequest>();

  const [error, setError] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [id, setId] = useState<string>();

  const lastProgressUpdate = useRef(0);

  useEffect(() => {
    setError(false);
    setProgress(undefined);
    setId(undefined);
  }, [expiresInSeconds, data]);

  useEffect(() => {
    const onProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const timePassedMs = Date.now() - lastProgressUpdate.current;
      if (event.lengthComputable && timePassedMs > 50) {
        setProgress(event.loaded / event.total);
        lastProgressUpdate.current = Date.now();
      }
    };

    const onLoadEnd = () => {
      if (request?.status === 200 && request.readyState === request.DONE) {
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
      setProgress(0);
    }
  }, [expiresInSeconds, data]);

  return [progress, id, error, upload];
};

export default useUpload;
