import { imagenCompartir, TAMANO_COMPARTIR } from "@/lib/imagen-compartir";

// v3: logo grande sin subtítulo (cambiar este archivo cambia la dirección de la imagen y WhatsApp la vuelve a pedir).

export const alt = "NexCode97: software en producción";
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default function Imagen() {
  return imagenCompartir();
}
