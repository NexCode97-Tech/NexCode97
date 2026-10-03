/** Quién responde por NexCode97 ante la ley (RUT como persona natural). Lo usan las páginas legales. */
export const RESPONSABLE = {
  nombre: "Hotman Julián Guevara Uribe",
  nit: "1.095.836.851-6",
  marca: "NexCode97",
  ciudad: "Bucaramanga, Santander, Colombia",
  direccion: "Calle 22 # 21-37, Apto 1406, Bucaramanga, Santander",
  correo: "nexcode97@gmail.com",
  telefono: "+57 300 635 9008",
  sitio: "https://www.nexcode97.com",
};

/** Fecha desde la que rigen las versiones publicadas. Se cambia con cada versión nueva. */
export const VIGENCIA = "3 de octubre de 2026";
/** La misma versión en formato fecha: se guarda con cada autorización (formulario de contacto y registro del CRM). */
export const VERSION_DOCUMENTOS = "2026-10-03";

export const PAGINAS_LEGALES = [
  { href: "/privacidad", titulo: "Política de privacidad" },
  { href: "/terminos", titulo: "Términos del servicio" },
  { href: "/uso-aceptable", titulo: "Uso aceptable" },
  { href: "/eliminar-datos", titulo: "Eliminación de datos" },
] as const;
