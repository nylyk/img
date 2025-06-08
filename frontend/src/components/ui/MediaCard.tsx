import { Minus } from 'lucide-react';
import React, { FC } from 'react';

import { MediaFile } from '@/utils/post';
import { cn } from '@/utils/utils';

const MediaCard: FC<{
  media: MediaFile;
  onRemove?: () => void;
  onChangeDescription?: (description: string) => void;
}> = ({ media, onRemove, onChangeDescription }) => {
  const isEditable = Boolean(onRemove || onChangeDescription);
  const isVideo = media.blob.type.startsWith('video');

  const onOpenImage = () => {
    if (!isEditable) {
      window.open(media.url);
    }
  };

  const _onChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    event.target.style.height = '1px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    onChangeDescription?.(event.target.value);
  };

  let descriptionBody = undefined;
  if (onChangeDescription) {
    descriptionBody = (
      <textarea
        rows={1}
        value={media.description}
        onChange={_onChangeDescription}
        className="w-full resize-none outline-0"
        placeholder={`Give your ${
          isVideo ? 'video' : 'image'
        } a description...`}
      />
    );
  } else if (media.description.length > 0) {
    descriptionBody = media.description;
  }

  return (
    <div className="group relative mt-3 w-full rounded-lg border border-zinc-200 bg-white p-2 shadow sm:mt-4 sm:rounded-xl sm:p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {onRemove && (
        <div
          className="absolute -top-2.5 -right-2.5 cursor-pointer rounded-full border border-zinc-300 bg-zinc-200 p-1 text-zinc-500 shadow transition group-hover:border-transparent group-hover:bg-red-400 group-hover:text-white dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
          onClick={onRemove}
        >
          <Minus />
        </div>
      )}
      {isVideo ? (
        <video className="w-full rounded" src={media.url} controls />
      ) : (
        <img
          className={cn('w-full rounded', { 'cursor-pointer': !isEditable })}
          src={media.url}
          onClick={onOpenImage}
        />
      )}
      {descriptionBody && (
        <div className="mt-2 -mb-0.5 text-[0.95rem] text-zinc-800 sm:mt-2.5 dark:text-zinc-400">
          {descriptionBody}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
