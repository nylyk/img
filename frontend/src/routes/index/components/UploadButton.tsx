import { FC } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../../utils/utils';

const UploadButton: FC<{
  text: string;
  subtext?: string;
  loading: boolean;
  ready: boolean;
  error: boolean;
  onClick: () => void;
}> = ({ text, subtext, loading, ready, error, onClick }) => {
  return (
    <button
      className={cn(
        'w-full h-20 flex flex-col justify-center items-center rounded-xl shadow-lg border-2 bg-gradient-to-tr from-zinc-500 to-zinc-400 text-white border-zinc-400 transition',
        {
          'cursor-pointer hover:brightness-92 from-emerald-600 to-emerald-400 border-emerald-300 dark:from-emerald-600/90 dark:to-emerald-500 dark:border-emerald-400':
            ready,
          'from-rose-600/90 to-rose-500/90 border-red-300 dark:border-rose-400':
            error,
        }
      )}
      onClick={() => ready && onClick()}
    >
      <span className="text-xl flex gap-2 items-center">
        {loading && (
          <LoaderCircle
            size={20}
            className="animate-spin -ml-2 text-zinc-300"
          />
        )}
        <span>{text}</span>
      </span>
      {subtext && <span className="text-sm">{subtext}</span>}
    </button>
  );
};

export default UploadButton;
