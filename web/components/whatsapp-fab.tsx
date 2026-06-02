"use client";

import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/573164134212"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{
        background: "linear-gradient(135deg,#25D366,#128C7E)",
        boxShadow: "0 4px 24px rgba(37,211,102,0.4)",
      }}
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
}
