import React, { FC } from 'react';
import { MediaFile } from '../../utils/post';
import { Minus } from 'lucide-react';
import { cn } from '../../utils/utils';

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
    event: React.ChangeEvent<HTMLTextAreaElement>
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
        className="w-full outline-0 resize-none"
        placeholder={`Give your ${
          isVideo ? 'video' : 'image'
        } a description...`}
      />
    );
  } else if (media.description.length > 0) {
    descriptionBody = media.description;
  }

  return (
    <div className="relative group w-full mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      {onRemove && (
        <div
          className="absolute -top-2.5 -right-2.5 p-1 cursor-pointer rounded-full shadow transition border bg-zinc-200 text-zinc-500 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 group-hover:bg-red-400 group-hover:text-white group-hover:border-transparent"
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
        <div className="mt-2 sm:mt-2.5 -mb-0.5 text-[0.95rem] text-zinc-800 dark:text-zinc-400">
          {descriptionBody}
        </div>
      )}
    </div>
  );
};

export default MediaCard;
