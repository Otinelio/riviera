// Hotel-wide constants. Update WHATSAPP_NUMBER with the real one (international format, no +).
export const HOTEL = {
  name: "Hotel Riviera Ramatou Plage",
  tagline: "L'Atlantique à vos pieds — Lomé, Togo",
  whatsapp: "22890000000", // À COMPLÉTER
  email: "contact@ramatouplage.tg",
  address: "Plage de Baguida, Zone du Port Autonome, Lomé, Togo",
  instagram: "ramatouplage",
};

export function waLink(message: string) {
  return `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(message)}`;
}
