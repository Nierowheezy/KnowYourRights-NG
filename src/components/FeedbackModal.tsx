import { useEffect, useState } from "react";

type FeedbackItem = {
  scenarioId: string;
  category: "missing" | "confusing" | "outdated";
  note: string;
  ts: number;
};

const STORAGE_KEY = "kyr-feedback-queue";

function readQueue(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeQueue(q: FeedbackItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
  } catch {}
}

export default function FeedbackModal({
  scenarioId,
  open,
  onClose,
}: {
  scenarioId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<"missing" | "confusing" | "outdated">("missing");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setCategory("missing");
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const item: FeedbackItem = { scenarioId, category, note: note.slice(0, 500), ts: Date.now() };
    const q = readQueue();
    q.push(item);
    writeQueue(q);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Flag this guide">
      <div className="modal">
        <h3>Flag this guide</h3>
        <p className="muted">No personal data is collected. Notes are stored locally on your device.</p>
        <label>
          Issue type
          <select value={category} onChange={e => setCategory(e.target.value as any)}>
            <option value="missing">Missing info</option>
            <option value="confusing">Confusing wording</option>
            <option value="outdated">Possibly outdated</option>
          </select>
        </label>
        <label>
          Note (optional, max 500 chars)
          <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={500} rows={4} placeholder="What is unclear or missing?" />
        </label>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={submit}>Save locally</button>
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
