export const BRAND = {
  name: "TK Airlines",
  tagline: "Fly the world, in premium comfort.",
  whatsappNumber: "447853169761", // +44 7853 169761
  whatsappDisplay: "+44 7853 169761",
  formspreeEndpoint: "https://formspree.io/f/mojzklze",
  supportEmail: "support@tkairlines.app",
};

export const waLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
