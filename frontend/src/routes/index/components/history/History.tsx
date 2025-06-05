import HistoryItemCard from './HistoryItemCard';
import useHistoryStore from '../../../../stores/historyStore';
import { HistoryItem } from '../../../../utils/history';

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
    <div className="w-full mt-1">
      <span className="text-lg leading-0">Recent Posts</span>
      {history.map((item) => (
        <HistoryItemCard
          item={item}
          onRemove={() => onRemoveItem(item)}
          key={item.id}
        />
      ))}
      {history.length === 0 && (
        <div className="w-full my-4 lg:my-5 text-center italic text-zinc-500 dark:text-zinc-400">
          No posts yet!
        </div>
      )}
    </div>
  );
};

export default History;
