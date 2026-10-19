/**
 * Gli importi dimostrativi sono stati riletti in euro con tasso fisso 1 GBP = 1,17 EUR.
 */
export const siteConfig = {
  name: "Autovanny",
  tagline: "I tuoi specialisti di auto di fiducia.",
  description:
    "Scopri la nostra selezione curata di auto usate e km0. Controllate sulla qualità, garantite per la tua tranquillità.",
  currency: "EUR",
  currencySymbol: "€",
  deposit: 210,
  contact: {
    phone: "0828 347 183",
    mobile: "335 421810",
    email: "hello@autovanny.com",
    address: {
      street: "Via S.S. 18 - Loc. Cioffi, 60",
      city: "84025 Eboli (SA)",
      country: "Italia",
    },
  },
  legal: {
    companyName: "Autovanny Group S.r.l.",
    address: "S.S. 18 Località Cioffi, 60 – 84025 Eboli (SA)",
    vat: "04659530655",
    rea: "SA - 383758",
    shareCapital: "€ 100.000,00 i.v.",
  },
  hours: [
    { day: "Lunedì – Sabato", time: "8:30 – 13:00" },
    { day: "Lunedì – Venerdi", time: "15:00 – 19:30" },
    { day: "Domenica", time: "Chiuso" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "KM0", href: "/showroom?condition=KM0" },
    { label: "Parco Auto", href: "/showroom" },
    { label: "Noleggio", href: "/showroom?rental=true" },
    { label: "Chi siamo", href: "/about" },
    { label: "Contatti", href: "/contact" },
  ],
  social: {
    instagram: "https://www.instagram.com/autovanny_groupsrl/",
    tiktok: "https://www.tiktok.com/@autovanny",
    facebook: "https://www.facebook.com/autovannygroupsrl",
    whatsapp: "https://wa.me/335421810",
  },
};

export const telHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

export const whatsappHref = (message?: string) => {
  const base = siteConfig.social.whatsapp.replace(/\/+$/, "");
  const text = message?.trim() || `Ciao ${siteConfig.name}, vorrei informazioni.`;
  return `${base}?text=${encodeURIComponent(text)}`;
};

export const whatsappNumber = siteConfig.social.whatsapp.split("/").pop() ?? "";

export const bricks = {
  featuredLimit: 6,
  perPage: 9,
};

const address = siteConfig.contact.address;
export const fullAddress = `${address.street}, ${address.city}, ${address.country}`;

export const mapsCoordinates = "40.5471689274401,14.98956832996587";

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsCoordinates)}&z=15&output=embed`;

export const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsCoordinates)}`;
