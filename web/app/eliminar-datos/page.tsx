import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Seccion } from "@/components/legal-page";
import { RESPONSABLE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Eliminación de datos | NexCode97",
  description: "Cómo pedir que NexCode97 borre tus datos personales, incluidos los recibidos por WhatsApp, Instagram, Messenger o el inicio de sesión con Google.",
  alternates: { canonical: "/eliminar-datos" },
};

export default function EliminarDatos() {
  const asunto = encodeURIComponent("Eliminar mis datos");
  return (
    <LegalPage
      ruta="/eliminar-datos"
      titulo="Eliminación de datos"
      resumen="Puedes pedir en cualquier momento que borremos tus datos personales. Aquí te explicamos cómo hacerlo según tu caso y qué pasa después."
    >
      <Seccion titulo="1. Si tienes una cuenta en el CRM o eres nuestro cliente">
        <ol>
          <li>Escribe a <a href={`mailto:${RESPONSABLE.correo}?subject=${asunto}`}>{RESPONSABLE.correo}</a> desde el correo de tu cuenta, con el asunto «Eliminar mis datos».</li>
          <li>Indica tu nombre y, si eres el administrador y quieres cerrar todo el espacio de tu empresa, dilo expresamente.</li>
          <li>Te confirmamos que recibimos la solicitud y, si hace falta, verificamos que eres el titular.</li>
          <li>Borramos tus datos en un plazo máximo de 15 días hábiles y te avisamos cuando esté hecho.</li>
        </ol>
        <p>Si cierras el espacio de tu empresa, puedes pedir antes una copia de tus datos.</p>
      </Seccion>

      <Seccion titulo="2. Si escribiste a una empresa que usa nuestro CRM">
        <p>Si conversaste por WhatsApp, Instagram, Messenger, Telegram, TikTok, correo o chat web con una empresa que atiende con el CRM de NexCode97, esa empresa es la responsable de tus datos. Pídele directamente que los borre.</p>
        <p>También puedes escribirnos a <a href={`mailto:${RESPONSABLE.correo}?subject=${asunto}`}>{RESPONSABLE.correo}</a> indicando el nombre de la empresa y el número o la cuenta desde la que le escribiste. Le trasladamos la solicitud y, por instrucción suya, borramos la información de su espacio.</p>
      </Seccion>

      <Seccion titulo="3. Si entraste con Google">
        <p>Además de pedirnos que borremos tu cuenta, puedes quitarle al CRM el acceso a tu cuenta de Google en <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>. Al hacerlo, el CRM deja de poder iniciar sesión con tu Google.</p>
      </Seccion>

      <Seccion titulo="4. Qué se borra y qué se conserva">
        <p>Borramos tu cuenta, tu perfil y los datos personales asociados. Solo conservamos lo que una ley nos obliga a guardar, como las facturas y los soportes contables, durante el plazo legal, y los registros de seguridad mínimos para probar que atendimos tu solicitud. Las copias de seguridad se sobrescriben en su ciclo normal.</p>
        <p>Más información sobre tus derechos en la <Link href="/privacidad#como-ejercerlos">política de privacidad</Link>.</p>
      </Seccion>
    </LegalPage>
  );
}
