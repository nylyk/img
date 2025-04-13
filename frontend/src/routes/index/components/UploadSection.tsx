import { FC, ReactNode, useMemo } from 'react';
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
  progress: number | undefined;
  error?: string;
  onClick: () => void;
}> = ({ state, progress, error, onClick }) => {
  const maxSize = 200 * 1024 ** 2;

  const isUploading = typeof progress === 'number';
  const isLoading = typeof state !== 'number';
  const isTooBig = typeof state === 'number' && state > maxSize;
  const isError = error || isTooBig;
  const isReady = !isError && !isLoading && !isUploading;

  let buttonBody: ReactNode = 'Upload';
  if (isUploading) {
    buttonBody = `Uploading ${(progress * 100).toFixed(0)}%`;
  } else if (isLoading) {
    buttonBody = (
      <>
        <LoaderCircle size={20} className="animate-spin -ml-2 text-zinc-300" />
        <span>{makeLoadingText(state)}</span>
      </>
    );
  } else if (isTooBig) {
    buttonBody = 'Post is too big';
  } else if (error) {
    buttonBody = 'Error';
  }

  let buttonSubtext = error;
  if (isReady || isTooBig) {
    buttonSubtext = `${formatSize(state)} / ${formatSize(maxSize)}`;
  }

  return (
    <button
      className={cn(
        'w-full h-20 flex flex-col justify-center items-center rounded-xl shadow-lg border-2 bg-gradient-to-tr from-zinc-500 to-zinc-400 text-white border-zinc-400 transition',
        {
          'cursor-pointer hover:brightness-95 from-emerald-600 to-emerald-400 border-emerald-300 dark:from-emerald-600/90 dark:to-emerald-500 dark:border-emerald-400':
            isReady,
          'from-rose-600/90 to-rose-500/90 border-red-300 dark:border-rose-400':
            isError,
          'from-emerald-600 to-emerald-400 border-emerald-300 dark:from-emerald-600/90 dark:to-emerald-500 dark:border-emerald-400':
            progress,
        }
      )}
      onClick={() => isReady && onClick()}
    >
      <span className="text-xl flex gap-2 items-center">{buttonBody}</span>
      {buttonSubtext && <span className="text-sm">{buttonSubtext}</span>}
    </button>
  );
};

export default UploadSection;
