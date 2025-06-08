import useHistoryStore from '@/stores/historyStore';
import { HistoryItem } from '@/utils/history';

import HistoryItemCard from './HistoryItemCard';

const History = () => {
  const { history, removeHistoryItem } = useHistoryStore();

  const onRemoveItem = (item: HistoryItem) => {
    fetch(`/api/post/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${item.secret}` },
    })
      .then(() => removeHistoryItem(item.id))
      .catch(console.error);
  };

  return (
    <div className="mt-1 w-full">
      <span className="text-lg leading-0">Recent Uploads</span>
      {history.map((item) => (
        <HistoryItemCard
          item={item}
          onRemove={() => onRemoveItem(item)}
          key={item.id}
        />
      ))}
      {history.length === 0 && (
        <div className="my-4 w-full text-center text-zinc-500 italic lg:my-5 dark:text-zinc-400">
          No uploads yet!
        </div>
      )}
    </div>
  );
};

export default History;
