import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';

interface MediaType {
  mimes: readonly string[];
  extensions: readonly string[];
}

// Single source of truth for accepted media. Extensions also serve as a
// fallback when the browser cannot determine a file's MIME type.
const mediaTypes: readonly MediaType[] = [
  // Images
  {
    mimes: ['image/jpeg', 'image/jpg'],
    extensions: ['jpg', 'jpeg', 'jpe', 'jfif'],
  },
  { mimes: ['image/png'], extensions: ['png'] },
  { mimes: ['image/apng'], extensions: ['apng'] },
  { mimes: ['image/gif'], extensions: ['gif'] },
  { mimes: ['image/webp'], extensions: ['webp'] },
  {
    mimes: ['image/avif', 'image/avif-sequence'],
    extensions: ['avif'],
  },
  { mimes: ['image/jxl'], extensions: ['jxl'] },
  { mimes: ['image/svg+xml'], extensions: ['svg', 'svgz'] },
  {
    mimes: ['image/bmp', 'image/x-ms-bmp'],
    extensions: ['bmp', 'dib'],
  },
  { mimes: ['image/tiff'], extensions: ['tif', 'tiff'] },
  {
    mimes: ['image/heic', 'image/heic-sequence', 'image/heif'],
    extensions: ['heic', 'heif'],
  },
  {
    mimes: ['image/x-icon', 'image/vnd.microsoft.icon'],
    extensions: ['ico'],
  },
  // Videos
  { mimes: ['video/mp4'], extensions: ['mp4'] },
  { mimes: ['video/x-m4v'], extensions: ['m4v'] },
  { mimes: ['video/webm'], extensions: ['webm'] },
  { mimes: ['video/ogg'], extensions: ['ogv', 'ogg'] },
  { mimes: ['video/quicktime'], extensions: ['mov'] },
  {
    mimes: ['video/x-matroska', 'video/matroska'],
    extensions: ['mkv'],
  },
  { mimes: ['video/mpeg'], extensions: ['mpg', 'mpeg'] },
  { mimes: ['video/x-msvideo'], extensions: ['avi'] },
  { mimes: ['video/3gpp'], extensions: ['3gp'] },
  { mimes: ['video/mp2t'], extensions: ['ts', 'm2t', 'mts'] },
  { mimes: ['video/x-flv'], extensions: ['flv'] },
];

const acceptedTypes = new Set(mediaTypes.flatMap(({ mimes }) => mimes));
const acceptedExtensions = new Set(
  mediaTypes.flatMap(({ extensions }) => extensions),
);

const accept = [
  ...acceptedTypes,
  ...[...acceptedExtensions].map((extension) => `.${extension}`),
].join(',');

// MIME types reported by browsers that cannot determine the actual format.
const unknownTypes = new Set(['', 'application/octet-stream']);

const getExtension = (fileName: string): string | undefined => {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex === -1
    ? undefined
    : fileName.substring(dotIndex + 1).toLowerCase();
};

const isAcceptedFile = (file: File): boolean => {
  const type = file.type.toLowerCase();
  if (acceptedTypes.has(type)) {
    return true;
  }
  // Only trust the extension when the MIME type is unknown, so mislabeled or
  // non-media files are not accepted just because of their name.
  if (!unknownTypes.has(type)) {
    return false;
  }
  const extension = getExtension(file.name);
  return extension !== undefined && acceptedExtensions.has(extension);
};

// During dragover the browser hides the file's name, so only the MIME type is
// available here. Unknown types are allowed and validated on drop instead.
const isAcceptedItem = (item: DataTransferItem): boolean => {
  const type = item.type.toLowerCase();
  return (
    item.kind === 'file' && (acceptedTypes.has(type) || unknownTypes.has(type))
  );
};

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
          if (file && isAcceptedFile(file)) {
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
    const accepted = Array.from(event.dataTransfer.items).some(isAcceptedItem);
    setCanDrop(accepted);
    setCannotDrop(!accepted);
  };

  const onDragLeave = () => {
    setCanDrop(false);
    setCannotDrop(false);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    for (const item of event.dataTransfer.items) {
      const file = item.getAsFile();
      if (file && isAcceptedFile(file)) {
        onAddFile(file);
      }
    }
    setCanDrop(false);
    setCannotDrop(false);
  };

  const onFilesSelected = () => {
    if (inputRef.current?.files) {
      for (const file of inputRef.current.files) {
        if (isAcceptedFile(file)) {
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
        accept={accept}
        multiple
        onChange={onFilesSelected}
        ref={inputRef}
      />
    </>
  );
};

export default Dropzone;
