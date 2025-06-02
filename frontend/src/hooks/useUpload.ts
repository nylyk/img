import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from 'common';
import { useLocalStorage } from '@uidotdev/usehooks';
import { SerializedHistory, serializeHistoryItem } from '../utils/history';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

const useUpload = (
  expiresInSeconds: number | undefined,
  data: string | undefined,
  title: string | undefined,
  password: string | undefined
): [number | undefined, string | undefined, boolean, () => void] => {
  const [error, setError] = useState(false);
  const [request, setRequest] = useState<XMLHttpRequest>();
  const [progress, setProgress] = useState<number>();
  const [id, setId] = useState<string>();

  const [serializedHistory, setSerializedHistory] =
    useLocalStorage<SerializedHistory>('history', []);

  const lastProgressUpdate = useRef(0);

  useEffect(() => {
    setError(false);
    setRequest(undefined);
    setProgress(undefined);
    setId(undefined);
  }, [expiresInSeconds, data]);

  useEffect(() => {
    const onProgress = (event: ProgressEvent<XMLHttpRequestEventTarget>) => {
      const timePassedMs = Date.now() - lastProgressUpdate.current;
      if (event.lengthComputable && timePassedMs > 75) {
        setProgress(event.loaded / event.total);
        lastProgressUpdate.current = Date.now();
      }
    };

    const onLoadEnd = () => {
      if (
        request?.status === 200 &&
        request.readyState === request.DONE &&
        password
      ) {
        const response: api.CreatePost = JSON.parse(request.responseText);
        setId(response.id);
        setSerializedHistory([
          serializeHistoryItem({
            title:
              title === undefined || title === ''
                ? dayjs().format('lll')
                : title,
            id: response.id,
            password,
            secret: response.secret,
            expiresAt: response.expiresAt,
          }),
          ...serializedHistory,
        ]);
      } else {
        setError(true);
      }
      setProgress(undefined);
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
