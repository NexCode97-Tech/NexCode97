import type { Metadata } from "next";
import Link from "next/link";
import { DatosResponsable, LegalPage, Seccion } from "@/components/legal-page";
import { RESPONSABLE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos del servicio | NexCode97",
  description: "Condiciones para usar el CRM de NexCode97 y los servicios de desarrollo de software.",
  alternates: { canonical: "/terminos" },
};

export default function Terminos() {
  return (
    <LegalPage
      ruta="/terminos"
      titulo="Términos del servicio"
      resumen="Estos términos regulan el uso del CRM de NexCode97 y de los servicios de desarrollo de software. Al crear una cuenta, entrar al CRM o contratar un servicio, los aceptas. Si los aceptas en nombre de una empresa, declaras que tienes facultad para obligarla."
    >
      <Seccion titulo="1. Quién presta el servicio">
        <DatosResponsable />
      </Seccion>

      <Seccion titulo="2. El servicio">
        <p>El CRM de NexCode97 es una plataforma en la nube para atender clientes desde una bandeja compartida que reúne WhatsApp, Instagram, Messenger, Telegram, TikTok, correo y chat web, con equipos, reparto de conversaciones, flujos, difusiones, agentes de inteligencia artificial, encuestas e informes.</p>
        <p>Cada empresa tiene su propio espacio, separado de los demás. Podemos mejorar, cambiar o retirar funciones; si un cambio afecta de forma importante lo que contrataste, te avisaremos con anticipación razonable.</p>
        <p>Los desarrollos de software a la medida se rigen además por la propuesta o el contrato de cada proyecto, que prevalece sobre estos términos en lo que regule de forma distinta.</p>
      </Seccion>

      <Seccion titulo="3. Cuentas">
        <ul>
          <li>Quien crea el espacio queda como su administrador y responde por las cuentas que crea y por lo que se haga con ellas.</li>
          <li>Los datos de registro deben ser reales y estar al día.</li>
          <li>Cada persona usa su propia cuenta. Guarda tu contraseña en secreto y avísanos de inmediato si sospechas un uso indebido.</li>
          <li>Debes ser mayor de edad para crear una cuenta.</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. Precios y pagos">
        <p>Los precios, la forma de pago y la periodicidad se acuerdan en la cotización, la propuesta o el plan contratado. Las facturas se emiten electrónicamente según la ley colombiana. Si un pago se atrasa más de 15 días después de avisarte, podemos suspender el servicio hasta que se ponga al día.</p>
        <p>Los costos que cobran terceros por los canales que conectas (por ejemplo, las conversaciones de WhatsApp que cobra Meta, o el saldo de los proveedores de inteligencia artificial cuando no estén incluidos en tu plan) corren por cuenta de la empresa, salvo que se pacte otra cosa.</p>
      </Seccion>

      <Seccion titulo="5. Canales y servicios de terceros">
        <p>Los canales los conecta cada empresa con sus propias cuentas (por ejemplo, su cuenta de WhatsApp Business). La empresa debe cumplir las condiciones y políticas de esos proveedores, como las <a href="https://business.whatsapp.com/policy" target="_blank" rel="noopener noreferrer">políticas de WhatsApp Business</a> y de Meta. No respondemos por cambios, caídas, bloqueos o cobros de esos proveedores.</p>
      </Seccion>

      <Seccion titulo="6. Inteligencia artificial">
        <p>Los agentes y sugerencias de inteligencia artificial generan textos de forma automática y pueden equivocarse. La empresa decide cuándo activarlos, debe revisar su configuración y su base de conocimiento, y responde por lo que se envíe a sus clientes. No deben usarse para tomar, sin revisión humana, decisiones con efectos legales o de similar importancia sobre una persona.</p>
      </Seccion>

      <Seccion titulo="7. Datos de tus clientes">
        <p>Lo que la empresa guarda en su espacio es de la empresa. Ella es la <strong>responsable</strong> de esos datos y nosotros los tratamos como <strong>encargados</strong>, en los términos de la Ley 1581 de 2012. En ese papel nos comprometemos a:</p>
        <ul>
          <li>Tratar los datos solo para prestar el servicio y según las instrucciones de la empresa.</li>
          <li>Guardar confidencialidad y mantener medidas de seguridad adecuadas.</li>
          <li>Usar solo los proveedores descritos en la <Link href="/privacidad">política de privacidad</Link>, con obligaciones equivalentes.</li>
          <li>Ayudar a la empresa a atender las consultas y reclamos de sus titulares.</li>
          <li>Avisar sin demora a la empresa si ocurre un incidente de seguridad que afecte sus datos.</li>
          <li>Entregar una copia de los datos y borrarlos al terminar el servicio, según la sección 10.</li>
        </ul>
        <p>La empresa, por su parte, garantiza que tiene la autorización de las personas cuyos datos carga o recibe, que les informa para qué los usa y que cumple las normas sobre contacto comercial, incluidos los horarios de la Ley 2300 de 2023 y la consulta del Registro de Números Excluidos de la CRC cuando corresponda.</p>
      </Seccion>

      <Seccion titulo="8. Uso aceptable">
        <p>El uso del CRM debe respetar la <Link href="/uso-aceptable">política de uso aceptable</Link>. Incumplirla puede llevar a la suspensión o cancelación de la cuenta.</p>
      </Seccion>

      <Seccion titulo="9. Propiedad intelectual">
        <p>El CRM, su código, diseño y marca son de NexCode97. Te damos una licencia de uso no exclusiva e intransferible mientras dure el servicio. No puedes copiarlo, revenderlo ni hacerle ingeniería inversa. Tú conservas la propiedad de tus datos, tus contenidos y tus marcas. La titularidad del software a la medida se define en la propuesta o el contrato de cada proyecto.</p>
      </Seccion>

      <Seccion titulo="10. Suspensión y terminación">
        <p>Puedes cancelar el servicio cuando quieras escribiéndonos; lo ya pagado por periodos en curso no se reembolsa, salvo que la ley o el acuerdo digan otra cosa. Podemos suspender o cancelar una cuenta por falta de pago, por incumplir estos términos o la política de uso aceptable, o por un riesgo serio para la seguridad del servicio o de terceros; salvo urgencia, te avisaremos antes.</p>
        <p>Al terminar, puedes pedir una copia de tus datos dentro de los 30 días siguientes. Pasado ese plazo, borramos el espacio y su contenido.</p>
      </Seccion>

      <Seccion titulo="11. Disponibilidad y responsabilidad">
        <p>Trabajamos para que el servicio esté disponible y funcione bien, con copias de seguridad y monitoreo, pero no garantizamos que nunca falle ni que esté libre de errores. Haremos mantenimientos, preferiblemente en horarios de bajo uso.</p>
        <p>En la medida en que la ley lo permita, nuestra responsabilidad total por cualquier reclamo se limita al valor que nos pagaste en los 3 meses anteriores al hecho que lo origina, y no respondemos por lucro cesante ni daños indirectos. Esta limitación no aplica en casos de dolo o culpa grave, ni afecta los derechos que la ley reconozca a los consumidores.</p>
      </Seccion>

      <Seccion titulo="12. Ley aplicable y controversias">
        <p>Estos términos se rigen por las leyes de Colombia. Ante cualquier diferencia, primero buscaremos un arreglo directo durante 30 días; si no se logra, la resolverán los jueces de Bucaramanga.</p>
      </Seccion>

      <Seccion titulo="13. Cambios">
        <p>Podemos actualizar estos términos. Publicaremos la nueva versión aquí con su fecha y, si el cambio es importante, te avisaremos antes de que aplique. Seguir usando el servicio después de esa fecha significa que aceptas la nueva versión.</p>
        <p>Dudas: <a href={`mailto:${RESPONSABLE.correo}`}>{RESPONSABLE.correo}</a>.</p>
      </Seccion>
    </LegalPage>
  );
}
