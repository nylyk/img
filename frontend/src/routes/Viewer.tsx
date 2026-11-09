import { useDocumentTitle } from '@uidotdev/usehooks';
import { Clock, FileQuestion, LoaderCircle, TriangleAlert } from 'lucide-react';
import { FC } from 'react';
import { DefaultParams } from 'wouter';

import FullscreenMessage from '@/components/ui/FullscreenMessage';
import MediaCard from '@/components/ui/MediaCard';
import useIntervalState from '@/hooks/useIntervalState';
import useLoadPost, { LoadState } from '@/hooks/useLoadPost';
import { formatTimeUntil } from '@/utils/utils';

const makeLoadingText = (state: LoadState, progress: number): string => {
  switch (state) {
    case 'download':
      return `Downloading ${Math.floor(progress * 100)}%`;
    case 'decryption':
      return 'Decrypting';
    case 'deserialization':
      return 'Deserializing';
  }
};

const Viewer: FC<{ params: DefaultParams }> = ({ params: { id } }) => {
  const password = location.hash.substring(1);

  const { state, progress, notFound, error, expiresAt, post } = useLoadPost(
    id!,
    password,
  );

  useDocumentTitle(
    post && post.title.length > 0 ? `${post.title} - img` : 'img',
  );

  const [expiryText, isExpired] = useIntervalState(
    5000,
    () =>
      expiresAt
        ? [formatTimeUntil(expiresAt), Date.now() > expiresAt]
        : [undefined, false],
    [expiresAt],
  );

  if (notFound) {
    return (
      <FullscreenMessage>
        <FileQuestion size={32} />
        <span>This link has expired or does not exist</span>
      </FullscreenMessage>
    );
  }

  if (error) {
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
          <span className="text-xl">{makeLoadingText(state, progress)}</span>
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
