export type FeedbackCategory = "missing" | "confusing" | "outdated";

const CATEGORIES: FeedbackCategory[] = ["missing", "confusing", "outdated"];

export type FeedbackItem = {
  scenarioId: string;
  category: FeedbackCategory;
  note: string;
  ts: number;
};

export const FEEDBACK_KEY = "kyr-feedback-queue";

export function readFeedback(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FeedbackItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as FeedbackItem).scenarioId === "string" &&
        CATEGORIES.includes((item as FeedbackItem).category) &&
        typeof (item as FeedbackItem).note === "string" &&
        typeof (item as FeedbackItem).ts === "number",
    );
  } catch {
    return [];
  }
}

export function writeFeedback(items: FeedbackItem[]): void {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(items));
  } catch {
    return;
  }
  window.dispatchEvent(new Event("kyr-feedback-changed"));
}

export function addFeedback(item: FeedbackItem): void {
  writeFeedback([...readFeedback(), item]);
}

export function exportFeedback(): void {
  const data = readFeedback();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kyr-feedback.json";
  link.click();
  URL.revokeObjectURL(url);
}
