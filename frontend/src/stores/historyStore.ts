import { create } from 'zustand';

import {
  History,
  HistoryItem,
  loadHistory,
  saveHistory,
} from '@/utils/history';

interface HistoryState {
  history: History;
  addHistoryItem: (item: HistoryItem) => void;
  removeHistoryItem: (id: string) => void;
}

const useHistoryStore = create<HistoryState>()((set) => ({
  history: loadHistory(),
  addHistoryItem: (item: HistoryItem) => {
    const history = [item, ...loadHistory()];
    saveHistory(history);
    set({ history });
  },
  removeHistoryItem: (id: string) => {
    const history = loadHistory().filter((item) => item.id != id);
    saveHistory(history);
    set({ history });
  },
}));

window.addEventListener('storage', (event) => {
  if (event.key === 'history' || event.key === null) {
    useHistoryStore.setState({ history: loadHistory() });
  }
});

setInterval(() => {
  const history = loadHistory();
  const newHistory = history.filter(
    (item) => new Date(item.expiresAt).getTime() > Date.now(),
  );

  if (history.length != newHistory.length) {
    useHistoryStore.setState({ history: newHistory });
    saveHistory(newHistory);
  }
}, 5000);

export default useHistoryStore;
