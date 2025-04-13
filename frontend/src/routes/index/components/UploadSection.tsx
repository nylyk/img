import { FC, useMemo } from 'react';
import { EncryptionState } from '../../../hooks/useEncrypt';
import { LoaderCircle } from 'lucide-react';
import { useMeasure } from '@uidotdev/usehooks';
import { cn, formatSize } from '../../../utils/utils';

const makeLoadingText = (state: EncryptionState): string => {
  switch (state) {
    case 'serialization':
      return 'Serializing';
    case 'compression':
      return 'Compressing';
    case 'encryption':
      return 'Encrypting';
    default:
      return 'Loading';
  }
};

const UploadSection: FC<{
  state: EncryptionState;
  error?: string;
  onClick: () => void;
}> = ({ state, error, onClick }) => {
  const maxSize = 50 * 1024 ** 2;

  const isLoading = typeof state !== 'number';
  const isTooBig = typeof state === 'number' && state > maxSize;
  const isError = error || isTooBig;
  const isSuccess = !isError && !isLoading;

  return (
    <button
      className={cn(
        'w-full h-20 flex flex-col justify-center items-center rounded-xl shadow-lg border-2 bg-gradient-to-tr from-zinc-500 to-zinc-400 text-white border-zinc-400 transition',
        {
          'cursor-pointer hover:brightness-95 from-emerald-600 to-emerald-400 border-emerald-300 dark:from-emerald-600/90 dark:to-emerald-500 dark:border-emerald-400':
            isSuccess,
          'from-rose-600/90 to-rose-500/90 border-red-300 dark:border-rose-400':
            isError,
        }
      )}
      onClick={onClick}
    >
      <span className="text-xl flex gap-2 items-center">
        {isSuccess && 'Upload'}
        {isLoading && (
          <>
            <LoaderCircle
              size={20}
              className="animate-spin -ml-2 text-zinc-300"
            />
            <span>{makeLoadingText(state)}</span>
          </>
        )}
        {isTooBig && 'Post is too big'}
        {error && 'Error'}
      </span>
      {(isSuccess || isTooBig) && (
        <span className="text-sm">
          {formatSize(state)} / {formatSize(maxSize)}
        </span>
      )}
      {error && <span className="text-sm">{error}</span>}
    </button>
  );
};

export default UploadSection;
