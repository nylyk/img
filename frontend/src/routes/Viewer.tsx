import { FC, useMemo } from 'react';
import useDecrypt, { DecryptionState } from '../hooks/useDecrypt';
import useFetch from '../hooks/useFetch';
import { api } from 'common';
import { useDocumentTitle } from '@uidotdev/usehooks';
import { DefaultParams } from 'wouter';
import { Clock, FileQuestion, LoaderCircle, TriangleAlert } from 'lucide-react';
import FullscreenMessage from '../components/ui/FullscreenMessage';
import MediaCard from '../components/ui/MediaCard';
import useIntervalState from '../hooks/useIntervalState';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);

const makeLoadingText = (state: DecryptionState): string => {
  switch (state) {
    case undefined:
      return 'Downloading';
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

  const [fetchResponse, fetchStatus, fetchError] = useFetch<api.Post>(
    `/api/post/${id}`
  );
  const [state, decryptionError, post] = useDecrypt(
    fetchResponse?.data,
    password
  );

  useDocumentTitle(
    post && post.title.length > 0 ? `${post.title} - img` : 'img'
  );

  const error = useMemo(
    () => (fetchError ? 'Error while fetching data' : decryptionError),
    [fetchError, decryptionError]
  );

  const expiresAt = useMemo(
    () => fetchResponse && new Date(fetchResponse.expiresAt).getTime(),
    [fetchResponse]
  );

  const [expiryText, isExpired] = useIntervalState(
    5000,
    () =>
      expiresAt
        ? [dayjs().to(expiresAt, true), Date.now() > expiresAt]
        : [undefined, false],
    [expiresAt]
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
          <span className="text-xl">{makeLoadingText(state)}</span>
        </div>
      </FullscreenMessage>
    );
  }

  return (
    <div className="w-full sm:w-xl md:w-2xl lg:w-3xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
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
