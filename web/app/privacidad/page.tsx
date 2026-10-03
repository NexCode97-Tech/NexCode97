import type { Metadata } from "next";
import Link from "next/link";
import { DatosResponsable, LegalPage, Seccion } from "@/components/legal-page";
import { RESPONSABLE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad | NexCode97",
  description: "Cómo NexCode97 trata los datos personales según la Ley 1581 de 2012: qué recogemos, para qué, con quién y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <LegalPage
      ruta="/privacidad"
      titulo="Política de tratamiento de datos personales"
      resumen="Esta política explica qué datos personales recogemos en el sitio nexcode97.com y en el CRM de NexCode97, para qué los usamos, con quién los compartimos y cómo puedes conocerlos, corregirlos o pedir que los borremos. Cumple la Ley 1581 de 2012 y el Decreto 1074 de 2015 (que incorpora el Decreto 1377 de 2013)."
    >
      <Seccion titulo="1. Quién es el responsable">
        <DatosResponsable conDireccion />
      </Seccion>

      <Seccion titulo="2. A qué aplica">
        <p>A los datos que tratamos en el sitio web, en el formulario de contacto, en los canales de atención (correo y WhatsApp) y en el CRM de NexCode97, incluido el inicio de sesión con Google.</p>
        <p>En el CRM cumplimos dos papeles distintos:</p>
        <ul>
          <li><strong>Responsables</strong> de los datos de quienes nos visitan o nos escriben, de nuestros clientes y de las personas que tienen una cuenta en el CRM.</li>
          <li><strong>Encargados</strong> de los datos que cada empresa cliente guarda o recibe en su espacio del CRM (sus contactos, conversaciones y archivos). Esos datos son de la empresa: ella es la responsable, define para qué se usan y debe tener la autorización de sus titulares. Nosotros los tratamos solo para prestarle el servicio y según sus instrucciones.</li>
        </ul>
      </Seccion>

      <Seccion titulo="3. Qué datos recogemos">
        <ul>
          <li><strong>Contacto:</strong> nombre, correo, teléfono, empresa y lo que nos cuentes en el formulario, por correo o por WhatsApp.</li>
          <li><strong>Cuenta del CRM:</strong> nombre, correo, empresa, foto (opcional) y contraseña, que guardamos cifrada y nunca en texto plano.</li>
          <li><strong>Inicio de sesión con Google:</strong> tu nombre, tu correo (verificado por Google) y tu foto de perfil. No accedemos a tu Gmail, tus contactos, tus archivos ni a ningún otro dato de tu cuenta de Google.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, navegador, fecha y hora de acceso y registros de seguridad (por ejemplo, intentos fallidos de inicio de sesión).</li>
          <li><strong>Contenido del CRM</strong> (como encargados): contactos, mensajes, notas, archivos y datos que lleguen por los canales que cada empresa conecta (WhatsApp, Instagram, Messenger, Telegram, TikTok, correo o chat web).</li>
        </ul>
        <p>No pedimos datos sensibles (salud, origen étnico, orientación sexual, creencias, datos biométricos). Si decides compartir alguno, es voluntario y no estás obligado a hacerlo. Nuestros servicios no están dirigidos a menores de edad.</p>
      </Seccion>

      <Seccion titulo="4. Para qué los usamos">
        <ul>
          <li>Responder tus preguntas, enviarte cotizaciones y propuestas.</li>
          <li>Crear y administrar tu cuenta, verificar tu identidad al entrar y recuperar tu contraseña.</li>
          <li>Prestar, mantener y dar soporte al CRM y a los desarrollos contratados.</li>
          <li>Proteger el servicio: prevenir accesos indebidos, fraude y abuso.</li>
          <li>Facturar, cobrar y cumplir obligaciones contables, tributarias y legales.</li>
          <li>Avisarte de cambios importantes del servicio o de esta política.</li>
          <li>Mejorar el servicio con estadísticas agregadas que no te identifican.</li>
          <li>Enviarte información comercial de NexCode97, solo si nos lo autorizas. Puedes retirar esa autorización cuando quieras.</li>
        </ul>
        <p>No vendemos ni alquilamos datos personales.</p>
      </Seccion>

      <Seccion titulo="5. Autorización">
        <p>Te pedimos autorización previa, expresa e informada antes de tratar tus datos: al enviar el formulario de contacto, al crear una cuenta o al entrar con Google aceptas esta política. Guardamos prueba de esa autorización. Puedes revocarla en cualquier momento, salvo cuando debamos conservar los datos por una obligación legal o contractual.</p>
      </Seccion>

      <Seccion titulo="6. Con quién los compartimos">
        <p>Usamos proveedores que tratan datos por cuenta nuestra (encargados), con contratos que les exigen confidencialidad y seguridad. Algunos están fuera de Colombia, por lo que hay transmisión internacional de datos, permitida por el artículo 25 del Decreto 1377 de 2013 bajo esos contratos:</p>
        <ul>
          <li><strong>Railway</strong> (Estados Unidos): servidor y base de datos del CRM.</li>
          <li><strong>Vercel</strong> (Estados Unidos): alojamiento del sitio web y estadísticas de visitas sin cookies.</li>
          <li><strong>Resend</strong> (Estados Unidos): envío de correos, como el de recuperación de contraseña.</li>
          <li><strong>Cloudinary</strong> (Estados Unidos): almacenamiento de archivos adjuntos del CRM.</li>
          <li><strong>Anthropic</strong> (Estados Unidos): procesa el texto de las conversaciones cuando una empresa activa los agentes de inteligencia artificial, para redactar respuestas y sugerencias.</li>
          <li><strong>Google</strong> (Estados Unidos): inicio de sesión con Google y transcripción de notas de voz (Gemini).</li>
          <li><strong>Meta, Telegram y TikTok</strong>: solo cuando una empresa conecta esos canales al CRM, para recibir y enviar sus mensajes.</li>
        </ul>
        <p>También entregaremos datos a autoridades cuando una norma o una orden judicial lo exija.</p>
      </Seccion>

      <Seccion titulo="7. Datos de Google">
        <p>El uso y la transferencia que hacemos de la información recibida de las API de Google se ajustan a la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Política de datos de usuario de los servicios de API de Google</a>, incluidos los requisitos de uso limitado. Usamos tu nombre, correo y foto de Google solo para iniciar tu sesión y mostrar tu perfil en el CRM; no los usamos para publicidad ni los compartimos con terceros. Puedes quitar el acceso en <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.</p>
      </Seccion>

      <Seccion titulo="8. Tus derechos">
        <p>Como titular de los datos tienes derecho a:</p>
        <ul>
          <li>Conocer, actualizar y corregir tus datos.</li>
          <li>Pedir prueba de la autorización que nos diste.</li>
          <li>Saber qué uso les hemos dado.</li>
          <li>Revocar la autorización o pedir que borremos tus datos, cuando no exista un deber legal o contractual de conservarlos.</li>
          <li>Acceder gratis a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber hecho tu solicitud ante nosotros.</li>
        </ul>
      </Seccion>

      <Seccion id="como-ejercerlos" titulo="9. Cómo ejercerlos">
        <p>Escribe a <a href={`mailto:${RESPONSABLE.correo}`}>{RESPONSABLE.correo}</a> desde el correo asociado a tus datos, con tu nombre, tu número de identificación, lo que pides y cómo quieres que te respondamos. Si actúas en nombre de otra persona, adjunta el documento que lo acredite.</p>
        <ul>
          <li><strong>Consultas</strong> (qué datos tenemos y cómo los usamos): respondemos en máximo 10 días hábiles, prorrogables 5 días hábiles más si te avisamos el motivo.</li>
          <li><strong>Reclamos</strong> (corregir, actualizar, borrar o revocar): respondemos en máximo 15 días hábiles, prorrogables 8 días hábiles más si te avisamos el motivo. Si al reclamo le falta información, te la pedimos dentro de los 5 días siguientes; si no la recibimos en 2 meses, entendemos que desististe.</li>
        </ul>
        <p>Si eres cliente de una empresa que usa nuestro CRM y quieres ejercer tus derechos sobre los datos que esa empresa tiene de ti, dirígete a ella, que es la responsable. Si nos escribes a nosotros, le trasladamos tu solicitud y la apoyamos para que te responda a tiempo. Más detalles en <Link href="/eliminar-datos">Eliminación de datos</Link>.</p>
      </Seccion>

      <Seccion titulo="10. Seguridad">
        <p>Protegemos los datos con conexiones cifradas (HTTPS), contraseñas cifradas con bcrypt, claves de los canales cifradas con AES-256, sesiones en cookies protegidas, separación estricta entre los espacios de cada empresa, permisos por rol y registros de seguridad. Ningún sistema es infalible: si ocurre un incidente que afecte tus datos, lo informaremos a la SIC y a las personas afectadas como exige la ley.</p>
      </Seccion>

      <Seccion titulo="11. Cuánto tiempo los guardamos">
        <p>Mientras dure la relación contigo o con la empresa que usa el CRM, y después durante el tiempo que exijan las normas contables, tributarias y legales. Cuando una empresa cancela su cuenta, borramos su espacio y su contenido en un plazo máximo de 30 días, salvo que nos pida antes una copia; las copias de seguridad se sobrescriben en su ciclo normal.</p>
      </Seccion>

      <Seccion titulo="12. Cookies">
        <p>El CRM usa solo cookies necesarias para funcionar: la de tu sesión y unas temporales mientras entras con Google. El sitio web no usa cookies de publicidad ni de seguimiento; las estadísticas de visitas se miden de forma agregada y sin cookies.</p>
      </Seccion>

      <Seccion titulo="13. Vigencia y cambios">
        <p>Esta política rige desde la fecha indicada arriba. Las bases de datos se conservan mientras se cumplan las finalidades descritas. Si la cambiamos de forma importante, lo avisaremos en el sitio o por correo antes de aplicar el cambio, y publicaremos aquí la nueva versión con su fecha.</p>
      </Seccion>
    </LegalPage>
  );
}
