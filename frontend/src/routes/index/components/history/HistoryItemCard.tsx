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
    [expiresAtTime]
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
    <div className="flex gap-2.5 mt-3 p-2.5 rounded-lg shadow border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <Link to={url}>
        <img src={thumbnail} className="w-14 min-w-14 rounded" />
      </Link>
      <div className="min-w-0 flex flex-col">
        <span className="flex gap-2 items-center">
          <Link to={url} className="truncate hover:underline">
            {title}
          </Link>
          {copied ? (
            <Check className="w-4 min-w-4" />
          ) : (
            <Copy
              className="w-4 min-w-4 cursor-pointer text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              onClick={onCopy}
            />
          )}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Expires in {expiryText}
        </span>
      </div>
      <X
        className="ml-auto w-6 min-w-6 cursor-pointer text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        onClick={onRemove}
      />
    </div>
  );
};

export default HistoryItemCard;
