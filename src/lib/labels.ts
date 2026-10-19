const FUEL_LABELS: Record<string, string> = {
  Petrol: "Benzina",
  Diesel: "Gasolio",
  Electric: "Elettrico",
  Hybrid: "Ibrido",
  "Plug-in Hybrid": "Ibrida plug-in",
};

const BODY_STYLE_LABELS: Record<string, string> = {
  Saloon: "Berlina",
  SUV: "SUV",
  Estate: "Station Wagon",
  Coupe: "Coupé",
  Convertible: "Cabriolet",
  Hatchback: "Utilitaria",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  Automatic: "Automatica",
  Manual: "Manuale",
};

const CONDITION_LABELS: Record<string, string> = {
  KM0: "KM0",
  Usato: "Usato",
  Rimmatricolato: "Rimmatricolato",
};

export interface SelectOption {
  value: string;
  label: string;
}

export const FUEL_OPTIONS: SelectOption[] = [
  { value: "Petrol", label: "Benzina" },
  { value: "Diesel", label: "Diesel" },
  { value: "Hybrid", label: "Ibrida" },
  { value: "Plug-in Hybrid", label: "Ibrida plug-in" },
  { value: "Electric", label: "Elettrica" },
  { value: "LPG", label: "GPL" },
  { value: "CNG", label: "Metano" },
];

export const TRANSMISSION_OPTIONS: SelectOption[] = [
  { value: "Automatic", label: "Automatica" },
  { value: "Manual", label: "Manuale" },
];

export const BODY_STYLE_OPTIONS: SelectOption[] = [
  { value: "Saloon", label: "Berlina" },
  { value: "SUV", label: "SUV" },
  { value: "Estate", label: "Familiare" },
  { value: "Coupe", label: "Coupé" },
  { value: "Convertible", label: "Cabriolet" },
  { value: "Hatchback", label: "Utilitaria" },
  { value: "Pickup", label: "Pick-up" },
  { value: "Van", label: "Furgone" },
];

export const CONDITION_OPTIONS: SelectOption[] = [
  { value: "KM0", label: "KM0" },
  { value: "Usato", label: "Usato" },
  { value: "Rimmatricolato", label: "Rimmatricolato" },
];

export function fuelOptionLabel(value: string): string {
  return FUEL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function transmissionOptionLabel(value: string): string {
  return TRANSMISSION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function bodyStyleOptionLabel(value: string): string {
  return BODY_STYLE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function conditionLabel(value?: string | null): string {
  if (!value) return "—";
  return CONDITION_LABELS[value] ?? value;
}

function label(map: Record<string, string>, value?: string | null): string {
  if (!value) return "—";
  return map[value] ?? value;
}

export function fuelLabel(value?: string | null): string {
  return label(FUEL_LABELS, value);
}

export function bodyStyleLabel(value?: string | null): string {
  return label(BODY_STYLE_LABELS, value);
}

export function transmissionLabel(value?: string | null): string {
  return label(TRANSMISSION_LABELS, value);
}
