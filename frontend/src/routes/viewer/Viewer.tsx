import { FC, useEffect, useMemo, useState } from 'react';
import useDecrypt, { DecryptionState } from '../../hooks/useDecrypt';
import useFetch from '../../hooks/useFetch';
import { api } from 'common';
import { useDocumentTitle } from '@uidotdev/usehooks';
import { DefaultParams } from 'wouter';
import MediaCard from './components/MediaCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoaderCircle, TriangleAlert } from 'lucide-react';

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
  const [fetchResponse, fetchError] = useFetch<api.Post>(`/api/post/${id}`);
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
      interval = setInterval(() => {
        setExpiryText(makeExpiryText(expiresAt));
      }, 5000);
      setExpiryText(makeExpiryText(expiresAt));
    }
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (error) {
    return (
      <div className="w-max max-w-full mx-auto translate-y-[32vh] flex flex-col items-center gap-3">
        <TriangleAlert size={32} className="text-red-500 dark:text-red-400" />
        <span>{error}</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-max max-w-full mx-auto translate-y-[32vh] flex gap-2">
        <LoaderCircle className="animate-spin text-zinc-500" />
        <span>{makeLoadingText(state)}</span>
      </div>
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
