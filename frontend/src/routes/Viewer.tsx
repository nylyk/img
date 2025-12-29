import { useDocumentTitle } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Clock, FileQuestion, LoaderCircle, TriangleAlert } from 'lucide-react';
import { FC, useMemo } from 'react';
import { DefaultParams } from 'wouter';

import FullscreenMessage from '@/components/ui/FullscreenMessage';
import MediaCard from '@/components/ui/MediaCard';
import useDecrypt, { DecryptionState } from '@/hooks/useDecrypt';
import useFetchPost from '@/hooks/useFetchPost';
import useIntervalState from '@/hooks/useIntervalState';

dayjs.extend(RelativeTime);

const makeLoadingText = (state: DecryptionState): string => {
  switch (state) {
    case 'decryption':
      return 'Decrypting';
    case 'deserialization':
      return 'Deserializing';
    default:
      return 'Loading';
  }
};

const Viewer: FC<{ params: DefaultParams }> = ({ params: { id } }) => {
  const password = location.hash.substring(1);

  const [fetchResponse, fetchStatus, fetchProgress, fetchError] = useFetchPost(
    `/api/post/${id}`,
  );
  const [state, decryptionError, post] = useDecrypt(
    fetchResponse?.data,
    password,
  );

  useDocumentTitle(
    post && post.title.length > 0 ? `${post.title} - img` : 'img',
  );

  const error = useMemo(
    () => (fetchError ? 'Error while fetching data' : decryptionError),
    [fetchError, decryptionError],
  );

  const [expiryText, isExpired] = useIntervalState(
    5000,
    () => {
      if (fetchResponse?.expiresAt) {
        return [
          dayjs().to(fetchResponse.expiresAt, true),
          Date.now() > fetchResponse.expiresAt,
        ];
      }
      return [undefined, false];
    },
    [fetchResponse?.expiresAt],
  );

  if (error) {
    if (fetchStatus === 404) {
      return (
        <FullscreenMessage>
          <FileQuestion size={32} />
          <span>This link has expired or does not exist</span>
        </FullscreenMessage>
      );
    }

    return (
      <FullscreenMessage>
        <TriangleAlert size={32} className="text-red-500 dark:text-red-400" />
        <span>{error}</span>
      </FullscreenMessage>
    );
  }

  if (isExpired) {
    return (
      <FullscreenMessage>
        <Clock size={32} />
        <span>This link has expired</span>
      </FullscreenMessage>
    );
  }

  if (!post) {
    return (
      <FullscreenMessage>
        <div className="flex items-center gap-2">
          <LoaderCircle size={26} className="animate-spin text-zinc-500" />
          <span className="text-xl">
            {state
              ? makeLoadingText(state)
              : `Downloading ${Math.floor(fetchProgress * 100)}%`}
          </span>
        </div>
      </FullscreenMessage>
    );
  }

  return (
    <div className="w-full sm:w-xl md:w-2xl lg:w-3xl xl:w-5xl">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
        <span className="text-xl sm:text-2xl">{post.title}</span>
        <span className="text-sm text-zinc-500">Expires in {expiryText}</span>
      </div>
      {post.files.map((file) => (
        <MediaCard media={file} key={file.url} />
      ))}
    </div>
  );
};

export default Viewer;
