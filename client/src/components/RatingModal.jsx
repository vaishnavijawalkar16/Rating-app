import React from "react";

export default function RatingModal({ store, onSubmit }) {
  if (!store) return null;
  const rating = store.my_rating || 5;
  const submit = async () => {
    const r = parseInt(prompt(`Enter rating for "${store.name}" (1-5):`, rating));
    if (!r || r < 1 || r > 5) { alert("Invalid rating"); return; }
    await onSubmit(store.id, r);
  };

  return (
    <div>
      <button className="btn btn-sm btn-success" onClick={submit}>Open Rate Prompt</button>
    </div>
  );
}
