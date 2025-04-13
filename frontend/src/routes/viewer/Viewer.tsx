import { FC, useEffect, useMemo, useState } from 'react';
import useDecrypt, { DecryptionState } from '../../hooks/useDecrypt';
import useFetch from '../../hooks/useFetch';
import { api } from 'common';
import { useDocumentTitle } from '@uidotdev/usehooks';
import { DefaultParams } from 'wouter';
import MediaCard from './components/MediaCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Clock, FileQuestion, LoaderCircle, TriangleAlert } from 'lucide-react';
import FullscreenMessage from './components/FullscreenMessage';

dayjs.extend(relativeTime);

const makeExpiryText = (expiresAt: Date): string => {
  return `Expires ${dayjs().to(expiresAt)}`;
};

const makeLoadingText = (state: DecryptionState): string => {
  switch (state) {
    case undefined:
      return 'Downloading';
    case 'decryption':
      return 'Decrypting';
    case 'decompression':
      return 'Decompressing';
    case 'deserialization':
      return 'Deserializing';
    default:
      return 'Loading';
  }
};

const Viewer: FC<{ params: DefaultParams }> = ({ params: { id } }) => {
  const password = location.hash.substring(1);

  const [error, setError] = useState<string>();
  const [fetchResponse, fetchStatus, fetchError] = useFetch<api.Post>(
    `/api/post/${id}`
  );
  const [state, decryptionError, post] = useDecrypt(
    fetchResponse?.data,
    password
  );

  const expiresAt = useMemo(() => {
    if (fetchResponse) {
      return new Date(fetchResponse?.expiresAt);
    }
  }, [fetchResponse]);
  const [expiryText, setExpiryText] = useState<string>();
  const [isExpired, setIsExpired] = useState(false);

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

  useEffect(() => {
    let interval = undefined;
    if (expiresAt) {
      const updateTime = () => {
        setIsExpired(Date.now() > expiresAt.getTime());
        setExpiryText(makeExpiryText(expiresAt));
      };

      interval = setInterval(updateTime, 5000);
      updateTime();
    }
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (error) {
    if (fetchStatus === 404) {
      return (
        <FullscreenMessage>
          <FileQuestion size={32} />
          <span>This post does not exist</span>
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
        <span>This post has expired</span>
      </FullscreenMessage>
    );
  }

  if (!post) {
    return (
      <FullscreenMessage>
        <div className="flex gap-2">
          <LoaderCircle className="animate-spin text-zinc-500" />
          <span>{makeLoadingText(state)}</span>
        </div>
      </FullscreenMessage>
    );
  }

  return (
    <div className="w-full sm:w-xl lg:w-2xl">
      <div className="flex justify-between items-center gap-2">
        <span className="text-xl sm:text-2xl">{post.title}</span>
        <span className="text-sm text-zinc-500">{expiryText}</span>
      </div>
      {post.files.map((file) => (
        <MediaCard media={file} key={file.url} />
      ))}
    </div>
  );
};

export default Viewer;
