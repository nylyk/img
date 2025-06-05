import { FC, useMemo } from 'react';
import { HistoryItem } from '../../../../utils/history';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { X } from 'lucide-react';
import useIntervalState from '../../../../hooks/useIntervalState';

dayjs.extend(RelativeTime);

const HistoryItemCard: FC<{ item: HistoryItem; onRemove: () => void }> = ({
  item: { title, id, expiresAt, secret },
  onRemove,
}) => {
  const expiresAtTime = useMemo(() => {
    return new Date(expiresAt).getTime();
  }, [expiresAt]);

  const [expiryText, isExpired] = useIntervalState(
    5000,
    () => [dayjs().to(expiresAtTime, true), Date.now() > expiresAtTime],
    [expiresAt]
  );

  return (
    <div className="w-full mt-3 p-2.5 rounded-lg shadow border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <span>{title}</span>
      <br />
      <span>{isExpired ? 'Expired' : `Expires in ${expiryText}`}</span>
      <div onClick={onRemove}>
        <X />
      </div>
    </div>
  );
};

export default HistoryItemCard;
