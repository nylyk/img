import { Plus } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { cn } from '../../../utils/utils';

const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/matroska',
];

const Dropzone: FC<{ compact?: boolean; onAddFile: (file: File) => void }> = ({
  compact = false,
  onAddFile,
}) => {
  const [canDrop, setCanDrop] = useState(false);
  const [cannotDrop, setCannotDrop] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      if (event.clipboardData) {
        for (const item of event.clipboardData.items) {
          const file = item.getAsFile();
          if (file && acceptedTypes.includes(file.type)) {
            onAddFile(file);
          }
        }
      }
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [onAddFile]);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const items = Array.from(event.dataTransfer.items).filter((item) =>
      item.type.startsWith('image')
    );
    if (items.length > 0) {
      return setCanDrop(true);
    }
    setCannotDrop(true);
  };

  const onDragLeave = () => {
    setCanDrop(false);
    setCannotDrop(false);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    for (const item of event.dataTransfer.items) {
      const file = item.getAsFile();
      if (file && acceptedTypes.includes(file.type)) {
        onAddFile(file);
      }
    }
    setCanDrop(false);
    setCannotDrop(false);
  };

  const onFilesSelected = () => {
    if (inputRef.current?.files) {
      for (const file of inputRef.current.files) {
        if (acceptedTypes.includes(file.type)) {
          onAddFile(file);
        }
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          'group w-full h-60 sm:h-72 mt-3 sm:mt-4 p-1 select-none cursor-pointer',
          {
            'h-30 sm:h-36': compact,
          }
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={cn(
            'w-full h-full rounded-2xl border-5 border-dashed flex flex-col justify-center items-center text-zinc-500 group-hover:text-zinc-950 dark:text-zinc-400 dark:group-hover:text-zinc-100 transition-colors',
            {
              'text-green-400 animate-pulse': canDrop,
              'text-red-600': cannotDrop,
            }
          )}
        >
          <Plus size={48} />
          <span className="text-xl">Paste, drag or click to add image</span>
        </div>
      </div>
      <input
        className="hidden"
        type="file"
        accept={acceptedTypes.join(',')}
        multiple
        onChange={onFilesSelected}
        ref={inputRef}
      />
    </>
  );
};

export default Dropzone;
