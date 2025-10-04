import { useEffect, useState } from 'react';

interface Post {
  data: Uint8Array<ArrayBuffer>;
  expiresAt: number;
}

const useFetchPost = (
  url: string,
): [Post | undefined, number | undefined, number, boolean] => {
  const [post, setPost] = useState<Post>();
  const [status, setStatus] = useState<number>();
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(undefined);
    setStatus(undefined);
    setProgress(0);
    setError(false);

    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    const onLoad = () => {
      setStatus(request.status);

      const expiresAt = request.getResponseHeader('img-expires-at');
      if (request.status != 200 || !request.response || !expiresAt) {
        return setError(true);
      }

      setPost({
        data: new Uint8Array(request.response),
        expiresAt: new Date(expiresAt).getTime(),
      });
    };

    const onError = (error: unknown) => {
      console.error(error);
      setError(true);
    };

    let lastProgressUpdate = 0;
    const onProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const now = Date.now();
      const timePassedMs = now - lastProgressUpdate;
      if (event.lengthComputable && timePassedMs > 100) {
        setProgress(event.loaded / event.total);
        lastProgressUpdate = now;
      }
    };

    request.addEventListener('load', onLoad);
    request.addEventListener('error', onError);
    request.addEventListener('progress', onProgress);
    request.send();

    return () => {
      request.removeEventListener('load', onLoad);
      request.removeEventListener('error', onError);
      request.removeEventListener('progress', onProgress);
      request.abort();
    };
  }, [url]);

  return [post, status, progress, error];
};

export default useFetchPost;
