import React, { FC } from 'react';
import { MediaFile } from '../../../utils/post';
import { Minus, X, XCircle } from 'lucide-react';

const EditableMediaCard: FC<{
  media: MediaFile;
  onRemove: () => void;
  onChangeDescription: (description: string) => void;
}> = ({ media, onRemove, onChangeDescription }) => {
  const isVideo = media.blob.type.startsWith('video');

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = '1px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    onChangeDescription(event.target.value);
  };

  return (
    <div className="relative group w-full mt-3 sm:mt-4 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <div
        className="absolute -top-2.5 -right-2.5 p-1 cursor-pointer rounded-full shadow transition border bg-zinc-200 text-zinc-500 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600 group-hover:bg-red-400 group-hover:text-white group-hover:border-transparent"
        onClick={onRemove}
      >
        <Minus />
      </div>
      {isVideo ? (
        <video className="w-full rounded" src={media.url} controls />
      ) : (
        <img className="w-full rounded" src={media.url} />
      )}
      <div className="mt-2 sm:mt-2.5 -mb-0.5 text-zinc-800 dark:text-zinc-400">
        <textarea
          rows={1}
          onChange={onChange}
          className="w-full outline-0 resize-none"
          placeholder={`Give your ${
            isVideo ? 'video' : 'image'
          } a description...`}
        />
      </div>
    </div>
  );
};

export default EditableMediaCard;
