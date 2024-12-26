import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';

const Index: FC = () => {
  const [images, setImages] = useState<string[]>([]);

  const [canDrop, setCanDrop] = useState(false);
  const [cannotDrop, setCannotDrop] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFile = (file: File) => {
    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((images) => [...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      if (event.clipboardData) {
        for (const item of event.clipboardData.items) {
          const file = item.getAsFile();
          if (file) {
            addFile(file);
          }
        }
      }
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  });

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
      if (file) {
        addFile(file);
      }
    }
    setCanDrop(false);
    setCannotDrop(false);
  };

  const onFilesSelected = () => {
    if (inputRef.current?.files) {
      for (const file of inputRef.current.files) {
        addFile(file);
      }
    }
  };

  return (
    <>
      {images.map((image, i) => (
        <img src={image} key={i} />
      ))}
      <div
        className="group w-96 h-64 p-5 select-none cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div
          className={clsx(
            'w-full h-full rounded-3xl border-8 border-dashed border-black flex flex-col justify-center items-center group-hover:text-blue-700 group-hover:border-blue-700 transition-colors',
            {
              'text-blue-700 border-blue-700 animate-pulse': canDrop,
              'text-red-700 border-red-700': cannotDrop,
            }
          )}
        >
          <span className="text-8xl">+</span>
          <span className="text-xl">Paste, drag or click to add image</span>
        </div>
      </div>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        multiple
        onChange={onFilesSelected}
        ref={inputRef}
      />
    </>
  );
};

export default Index;
