"use client";

import { useState, useEffect } from "react";

function ContactFormContent({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "", company: "", description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", whatsapp: "", company: "", description: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#ffffff",
  } as React.CSSProperties;

  const labelStyle = { color: "#94a3b8" } as React.CSSProperties;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{ background: "#0f0f14", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
        >
          ✕
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: "#ffffff" }}>
            Hablemos de tu proyecto
          </h2>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Cuéntanos qué necesitas y te respondemos por WhatsApp en menos de 24 horas.
          </p>
        </div>

        {status === "success" ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}
          >
            <p className="text-2xl font-bold mb-2" style={{ color: "#4ade80" }}>¡Mensaje recibido!</p>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              Nos pondremos en contacto contigo por WhatsApp muy pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Nombre *" name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required inputStyle={inputStyle} labelStyle={labelStyle} />
              <Field label="WhatsApp *" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+57 300 000 0000" required inputStyle={inputStyle} labelStyle={labelStyle} />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Correo" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" inputStyle={inputStyle} labelStyle={labelStyle} />
              <Field label="Empresa" name="company" value={form.company} onChange={handleChange} placeholder="Nombre de tu negocio" inputStyle={inputStyle} labelStyle={labelStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={labelStyle}>¿Qué necesitas? *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe tu proyecto o idea..."
                className="rounded-lg px-4 py-3 text-sm outline-none resize-none transition-colors"
                style={inputStyle}
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-center" style={{ color: "#f87171" }}>
                Ocurrió un error. Por favor intenta de nuevo.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl py-3 text-sm font-bold transition-opacity disabled:opacity-60"
              style={{ background: "#FFF200", color: "#09090e" }}
            >
              {status === "loading" ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ContactFormModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open:contact-form", handler);
    return () => window.removeEventListener("open:contact-form", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return <ContactFormContent onClose={() => setOpen(false)} />;
}

function Field({
  label, name, type = "text", value, onChange, placeholder, required, inputStyle, labelStyle,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean;
  inputStyle: React.CSSProperties; labelStyle: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
        style={inputStyle}
      />
    </div>
  );
}
