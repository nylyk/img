import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Check, Copy, QrCode as QrCodeIcon, Trash2 } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { Link } from 'wouter';

import QrCode from '@/components/ui/QrCode';
import useIntervalState from '@/hooks/useIntervalState';
import { HistoryItem } from '@/utils/history';

dayjs.extend(RelativeTime);

const HistoryItemCard: FC<{ item: HistoryItem; onRemove: () => void }> = ({
  item: { title, id, password, expiresAt, thumbnail },
  onRemove,
}) => {
  const expiresAtTime = useMemo(() => {
    return new Date(expiresAt).getTime();
  }, [expiresAt]);

  const expiryText = useIntervalState(
    5000,
    () => dayjs().to(expiresAtTime, true),
    [expiresAtTime],
  );

  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const url = `${location.origin}/${id}#${password}`;

  const onCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <div className="mt-3 flex gap-2.5 rounded-lg border border-zinc-200 bg-white p-2.5 shadow dark:border-zinc-800 dark:bg-zinc-900">
      <Link to={url}>
        <img src={thumbnail} className="w-13 min-w-13 rounded" />
      </Link>
      <div className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2">
          <Link to={url} className="truncate hover:underline">
            {title}
          </Link>
          <div className="flex gap-1">
            <div title="Copy URL">
              {copied ? (
                <Check className="w-4 min-w-4" />
              ) : (
                <Copy
                  className="w-4 min-w-4 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                  onClick={onCopy}
                />
              )}
            </div>
            <div
              className="relative"
              title="Show QR Code"
              tabIndex={-1}
              onClick={() => setShowQrCode(!showQrCode)}
              onBlur={() => setShowQrCode(false)}
            >
              <QrCodeIcon className="w-4 min-w-4 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100" />
              <div className="absolute z-10 translate-x-[-45.5%]">
                {showQrCode && <QrCode text={url} />}
              </div>
            </div>
          </div>
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Expires in {expiryText}
        </span>
      </div>
      <div className="ml-auto" title="Delete">
        <Trash2
          className="w-4.5 min-w-4.5 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
          onClick={onRemove}
        />
      </div>
    </div>
  );
};

export default HistoryItemCard;
