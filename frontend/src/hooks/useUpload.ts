import { api } from 'common';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useCallback, useEffect, useRef, useState } from 'react';

import useHistoryStore from '@/stores/historyStore';
import { Post } from '@/utils/post';
import { renderThumbnail } from '@/utils/thumbnail';

dayjs.extend(LocalizedFormat);

const useUpload = (
  expiresInSeconds: number | undefined,
  data: string | undefined,
  password: string | undefined,
  post: Post | undefined,
): [number | undefined, string | undefined, boolean, () => void] => {
  const [error, setError] = useState(false);
  const [request, setRequest] = useState<XMLHttpRequest>();
  const [progress, setProgress] = useState<number>();
  const [id, setId] = useState<string>();

  const addHistoryItem = useHistoryStore((state) => state.addHistoryItem);

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

        if (post && post.files[0]) {
          renderThumbnail(post.files[0])
            .then((thumbnail) => {
              addHistoryItem({
                title:
                  post?.title === undefined || post.title === ''
                    ? dayjs().format('lll')
                    : post.title,
                id: response.id,
                password,
                secret: response.secret,
                expiresAt: response.expiresAt,
                thumbnail,
              });
            })
            .catch(console.error);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
