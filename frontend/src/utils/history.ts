export interface HistoryItem {
  title: string;
  id: string;
  password: string;
  secret: string;
  expiresAt: string;
}
export type History = HistoryItem[];

type SerializedHistoryItem = [string, string, string, string, string];
export type SerializedHistory = SerializedHistoryItem[];

export const serializeHistoryItem = (
  item: HistoryItem
): SerializedHistoryItem => {
  return [item.title, item.id, item.password, item.secret, item.expiresAt];
};

export const serializeHistory = (history: History): SerializedHistory => {
  return history.map(serializeHistoryItem);
};

export const deserializeHistory = (serializedHistory: unknown): History => {
  if (!Array.isArray(serializedHistory)) {
    return [];
  }

  return serializedHistory
    .filter(
      (item) =>
        Array.isArray(item) &&
        item.length === 5 &&
        item.every((i) => typeof i === 'string')
    )
    .map((item) => ({
      title: item[0],
      id: item[1],
      password: item[2],
      secret: item[3],
      expiresAt: item[4],
    }));
};
