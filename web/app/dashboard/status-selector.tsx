"use client";

import { useTransition } from "react";

const STATUS_OPTIONS = ["nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLORS: Record<string, string> = {
  nuevo: "#FFF200",
  contactado: "#60a5fa",
  ganado: "#4ade80",
  perdido: "#f87171",
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

  const color = STATUS_COLORS[status] ?? "#64748b";

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={pending}
      className="rounded-full px-3 py-1 text-xs font-semibold cursor-pointer outline-none disabled:opacity-50"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s} style={{ background: "#09090e", color: "#ffffff" }}>
          {s}
        </option>
      ))}
    </select>
  );
}
