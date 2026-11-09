import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';

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
      if (event.clipboardData) {
        for (const item of event.clipboardData.items) {
          const file = item.getAsFile();
          if (file && acceptedTypes.includes(file.type)) {
            event.preventDefault();
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
      acceptedTypes.includes(item.type),
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
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <div
        className={clsx(
          'group mt-3 w-full cursor-pointer p-1 select-none sm:mt-4',
          compact ? 'h-32 sm:h-40' : 'h-52 sm:h-70',
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={clsx(
            'flex h-full w-full flex-col items-center justify-center rounded-2xl border-5 border-dashed transition duration-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100',
            cannotDrop
              ? 'text-red-600/80 dark:text-red-400/80'
              : canDrop
                ? 'scale-103 animate-pulse text-zinc-950 dark:text-zinc-100'
                : 'text-zinc-500 dark:text-zinc-400',
          )}
        >
          <Plus size={48} />
          <span className="hidden text-xl sm:block">
            Paste, drag or click to add image
          </span>
          <span className="text-lg sm:hidden">Click to add image</span>
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
