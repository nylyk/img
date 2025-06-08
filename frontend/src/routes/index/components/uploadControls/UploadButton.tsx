import { LoaderCircle } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';

import { cn } from '@/utils/utils';

const UploadButton: FC<{
  text: string;
  subtext?: string;
  loading: boolean;
  ready: boolean;
  progress?: number;
  error: boolean;
  onClick: () => void;
}> = ({ text, subtext, loading, ready, progress, error, onClick }) => {
  const loadingBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingBar.current && progress) {
      loadingBar.current.style.scale = `${progress * 100}% 100%`;
    }
  }, [progress]);

  return (
    <button
      className={cn(
        'relative flex h-20 w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-zinc-500 to-zinc-400 text-white shadow-md transition',
        {
          'cursor-pointer from-emerald-600 to-emerald-400 hover:brightness-93 dark:from-emerald-600/90 dark:to-emerald-500':
            ready,
          'from-rose-600/90 to-rose-500/90': error,
        },
      )}
      onClick={() => ready && onClick()}
    >
      {progress != undefined && (
        <div
          className="absolute left-0 z-10 h-full w-full origin-left scale-x-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 transition-transform dark:from-emerald-600/90 dark:to-emerald-500"
          ref={loadingBar}
        />
      )}
      <span className="z-20 flex items-center gap-2 text-xl">
        {loading && (
          <LoaderCircle
            size={20}
            className="-ml-2 animate-spin text-zinc-300"
          />
        )}
        <span>{text}</span>
      </span>
      {subtext && <span className="z-20 text-sm">{subtext}</span>}
    </button>
  );
};

export default UploadButton;
