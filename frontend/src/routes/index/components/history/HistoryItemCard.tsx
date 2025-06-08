import { FC, useMemo, useState } from 'react';
import { HistoryItem } from '../../../../utils/history';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { Check, Copy, X } from 'lucide-react';
import useIntervalState from '../../../../hooks/useIntervalState';
import { Link } from 'wouter';

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
          {copied ? (
            <Check className="w-4 min-w-4" />
          ) : (
            <Copy
              className="w-4 min-w-4 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
              onClick={onCopy}
            />
          )}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Expires in {expiryText}
        </span>
      </div>
      <X
        className="ml-auto w-6 min-w-6 cursor-pointer text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        onClick={onRemove}
      />
    </div>
  );
};

export default HistoryItemCard;
