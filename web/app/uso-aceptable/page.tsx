import type { Metadata } from "next";
import { LegalPage, Seccion } from "@/components/legal-page";
import { RESPONSABLE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Uso aceptable | NexCode97",
  description: "Lo que no está permitido hacer con el CRM de NexCode97: spam, contacto sin autorización, contenido ilegal y abuso del servicio.",
  alternates: { canonical: "/uso-aceptable" },
};

export default function UsoAceptable() {
  return (
    <LegalPage
      ruta="/uso-aceptable"
      titulo="Política de uso aceptable"
      resumen="El CRM de NexCode97 sirve para atender bien a los clientes de cada empresa. Esta política dice qué no se puede hacer con él. Aplica a todas las cuentas y hace parte de los términos del servicio."
    >
      <Seccion titulo="1. Contacto con personas">
        <p>No está permitido:</p>
        <ul>
          <li>Enviar spam o mensajes masivos a personas que no hayan autorizado recibirlos.</li>
          <li>Contactar con fines comerciales a personas inscritas en el Registro de Números Excluidos de la CRC sin su autorización previa.</li>
          <li>Enviar mensajes o hacer llamadas comerciales por fuera de los horarios de la Ley 2300 de 2023: de lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos.</li>
          <li>Seguir escribiendo a quien pidió no ser contactado, o no darle una forma fácil de pedirlo.</li>
          <li>Comprar, alquilar o usar bases de datos de contactos obtenidas sin autorización de sus titulares.</li>
          <li>Incumplir las políticas de los canales conectados, como las de WhatsApp Business, Instagram o Messenger.</li>
        </ul>
      </Seccion>

      <Seccion titulo="2. Contenido">
        <p>No está permitido usar el CRM para enviar, guardar o difundir:</p>
        <ul>
          <li>Contenido ilegal, o que promueva actividades ilegales.</li>
          <li>Cualquier contenido que sexualice o explote a menores de edad.</li>
          <li>Amenazas, acoso, discursos de odio o discriminación.</li>
          <li>Engaños, fraudes, phishing o suplantación de personas, marcas o entidades.</li>
          <li>Productos o servicios prohibidos por la ley o por las políticas comerciales de Meta y de los demás canales.</li>
          <li>Material que viole derechos de autor, marcas o la privacidad de otros.</li>
          <li>Software malicioso o enlaces a él.</li>
        </ul>
      </Seccion>

      <Seccion titulo="3. Datos personales">
        <ul>
          <li>Recoger o tratar datos sensibles o de menores sin cumplir los requisitos especiales de la Ley 1581 de 2012.</li>
          <li>Usar los datos de los contactos para fines distintos a los que se les informaron.</li>
          <li>Hacer pasar las respuestas automáticas por las de una persona cuando alguien pregunte directamente si habla con una persona.</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. El servicio">
        <ul>
          <li>Intentar entrar a cuentas o espacios ajenos, o a partes del sistema sin permiso.</li>
          <li>Probar, escanear o atacar la seguridad del servicio sin autorización escrita.</li>
          <li>Sobrecargarlo a propósito o automatizar su uso de forma abusiva.</li>
          <li>Copiarlo, hacerle ingeniería inversa, revenderlo o compartir cuentas sin un acuerdo con NexCode97.</li>
        </ul>
      </Seccion>

      <Seccion titulo="5. Qué pasa si se incumple">
        <p>Según la gravedad, podemos avisar, retirar el contenido, limitar funciones, suspender o cancelar la cuenta, e informar a las autoridades o a los proveedores de los canales cuando la ley lo exija o haya riesgo para terceros.</p>
      </Seccion>

      <Seccion titulo="6. Reportar un abuso">
        <p>Si recibiste mensajes indebidos de una empresa que usa nuestro CRM, o detectas un uso que va contra esta política, escríbenos a <a href={`mailto:${RESPONSABLE.correo}`}>{RESPONSABLE.correo}</a> con el número o la cuenta desde la que te escribieron y, si puedes, una captura.</p>
      </Seccion>
    </LegalPage>
  );
}
