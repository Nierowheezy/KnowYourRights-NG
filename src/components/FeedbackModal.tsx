import { useState } from "react";
import { addFeedback, type FeedbackCategory } from "../lib/feedback";

export default function FeedbackModal({
  scenarioId,
  open,
  onClose,
}: {
  scenarioId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<FeedbackCategory>("missing");
  const [note, setNote] = useState("");

  if (!open) return null;

  const submit = () => {
    addFeedback({ scenarioId, category, note: note.slice(0, 500), ts: Date.now() });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Flag this guide">
      <div className="modal">
        <h3>Flag this guide</h3>
        <p className="muted">No personal data is collected. Notes are stored locally on your device.</p>
        <label>
          Issue type
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as FeedbackCategory)}
          >
            <option value="missing">Missing info</option>
            <option value="confusing">Confusing wording</option>
            <option value="outdated">Possibly outdated</option>
          </select>
        </label>
        <label>
          Note (optional, max 500 chars)
          <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={4} placeholder="What is unclear or missing?" />
        </label>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={submit}>Save locally</button>
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
