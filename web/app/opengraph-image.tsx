import { imagenCompartir, TAMANO_COMPARTIR } from "@/lib/imagen-compartir";

export const alt = "NexCode97: cada negocio merece su propio sistema";
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default function Imagen() {
  return imagenCompartir("Cada negocio merece su propio sistema");
}
