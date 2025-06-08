import { create } from 'zustand';

import {
  History,
  HistoryItem,
  loadHistory,
  saveHistory,
} from '../utils/history';

interface HistoryState {
  history: History;
  addHistoryItem: (item: HistoryItem) => void;
  removeHistoryItem: (id: string) => void;
}

const useHistoryStore = create<HistoryState>()((set) => ({
  history: loadHistory(),
  addHistoryItem: (item: HistoryItem) => {
    set((state) => {
      const history = [item, ...state.history];
      saveHistory(history);
      return { history };
    });
  },
  removeHistoryItem: (id: string) => {
    set((state) => {
      const history = state.history.filter((item) => item.id != id);
      saveHistory(history);
      return { history };
    });
  },
}));

setInterval(() => {
  const history = useHistoryStore.getState().history;
  const newHistory = history.filter(
    (item) => new Date(item.expiresAt).getTime() > Date.now(),
  );

  if (history.length != newHistory.length) {
    useHistoryStore.setState({ history: newHistory });
    saveHistory(newHistory);
  }
}, 5000);

export default useHistoryStore;
