export interface HistoryItem {
  title: string;
  id: string;
  password: string;
  secret: string;
  expiresAt: string;
  thumbnail: string;
}
export type History = HistoryItem[];

export const saveHistory = (history: History) => {
  const serializedHistory = history.map((item) => [
    item.title,
    item.id,
    item.password,
    item.secret,
    item.expiresAt,
    item.thumbnail,
  ]);

  localStorage.setItem('history', JSON.stringify(serializedHistory));
};

export const loadHistory = (): History => {
  const history = localStorage.getItem('history');
  if (!history) {
    return [];
  }

  let parsedHistory;
  try {
    parsedHistory = JSON.parse(history);
  } catch {
    localStorage.removeItem('history');
    return [];
  }

  if (!Array.isArray(parsedHistory)) {
    return [];
  }

  return parsedHistory
    .filter(
      (item) =>
        Array.isArray(item) &&
        item.length === 6 &&
        item.every((i) => typeof i === 'string'),
    )
    .map((item) => ({
      title: item[0],
      id: item[1],
      password: item[2],
      secret: item[3],
      expiresAt: item[4],
      thumbnail: item[5],
    }));
};
