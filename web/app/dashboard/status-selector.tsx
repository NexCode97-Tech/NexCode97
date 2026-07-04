"use client";

import { useTransition } from "react";

const STATUS_OPTIONS = ["nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  nuevo:      { bg: "#fef9c3", text: "#a16207", border: "#fde68a" },
  contactado: { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" },
  ganado:     { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
  perdido:    { bg: "#fee2e2", text: "#b91c1c", border: "#fecaca" },
};

export function StatusSelector({
  id,
  status,
  action,
}: {
  id: string;
  status: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", e.target.value);
    startTransition(() => action(formData));
  }

  const c = STATUS_COLORS[status] ?? { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" };

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={pending}
      className="rounded-full px-3 py-1 text-xs font-bold cursor-pointer outline-none disabled:opacity-50"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s} style={{ background: "#ffffff", color: "#1a1c1e" }}>
          {s}
        </option>
      ))}
    </select>
  );
}
