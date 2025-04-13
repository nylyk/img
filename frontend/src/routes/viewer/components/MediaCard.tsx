import { FC } from 'react';
import { MediaFile } from '../../../utils/post';

const MediaCard: FC<{ media: MediaFile }> = ({ media }) => {
  const isVideo = media.blob.type.startsWith('video');

  const onOpenImage = () => {
    window.open(media.url);
  };

  return (
    <div className="w-full mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      {isVideo ? (
        <video className="w-full rounded" src={media.url} controls />
      ) : (
        <img
          className="w-full rounded cursor-pointer"
          onClick={onOpenImage}
          src={media.url}
        />
      )}
      {media.description.length > 0 && (
        <div className="mt-2 sm:mt-2.5 -mb-0.5 text-[0.9rem] text-zinc-800 dark:text-zinc-400">
          {media.description}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
