import { FC, useEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../../utils/utils';

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
      loadingBar.current.style.transform = `scaleX(${progress * 100}%)`;
    }
  }, [progress]);

  return (
    <button
      className={cn(
        'relative w-full h-20 flex flex-col justify-center items-center rounded-xl overflow-hidden shadow-md bg-gradient-to-tr from-zinc-500 to-zinc-400 text-white transition',
        {
          'cursor-pointer hover:brightness-93 from-emerald-600 to-emerald-400 dark:from-emerald-600/90 dark:to-emerald-500':
            ready,
          'from-rose-600/90 to-rose-500/90': error,
        }
      )}
      onClick={() => ready && onClick()}
    >
      {progress != undefined && (
        <div
          className="absolute left-0 w-full h-full origin-left scale-x-0 z-10 transition-transform bg-gradient-to-tr from-emerald-600 to-emerald-400 dark:from-emerald-600/90 dark:to-emerald-500"
          ref={loadingBar}
        />
      )}
      <span className="text-xl flex gap-2 items-center z-20">
        {loading && (
          <LoaderCircle
            size={20}
            className="animate-spin -ml-2 text-zinc-300"
          />
        )}
        <span>{text}</span>
      </span>
      {subtext && <span className="text-sm z-20">{subtext}</span>}
    </button>
  );
};

export default UploadButton;
