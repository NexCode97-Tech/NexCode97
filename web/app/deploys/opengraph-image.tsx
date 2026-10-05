import { imagenCompartir, TAMANO_COMPARTIR } from "@/lib/imagen-compartir";

export const alt = "NexCode97: software en producción";
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default function Imagen() {
  return imagenCompartir("Software en producción");
}
