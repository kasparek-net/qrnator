import type { QRPayload } from "./qr-types";
import type { QRStyle } from "./qr-style";

const KEY = "qrnator-history";
const MAX = 30;

export type HistoryItem = {
  id: string;
  createdAt: number;
  payload: QRPayload;
  style: QRStyle;
  frameLabel: string;
  frameColor: string;
  thumbnail: string;
};

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    // quota exceeded — drop oldest
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, 10)));
    } catch {}
  }
}

export function addToHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const existing = loadHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  saveHistory([newItem, ...existing]);
  return newItem;
}

export function removeFromHistory(id: string) {
  saveHistory(loadHistory().filter((i) => i.id !== id));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
