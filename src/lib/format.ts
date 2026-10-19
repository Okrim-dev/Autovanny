import { siteConfig } from "./site";

const LOCALE = "it-IT";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

export function formatMileage(miles: number): string {
  return `${formatNumber(miles)} km`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatPower(bhp: number): string {
  return `${formatNumber(Math.round(bhp * 1.01387))} cv`;
}

export function formatDisplacement(cc: number): string {
  return `${formatNumber(cc)} cc`;
}

export function parseEngineDisplacement(engine?: string | null): number | null {
  if (!engine) return null;
  const match = engine.match(/(\d{1,2}[.,]\d)/);
  if (!match) return null;
  const liters = Number.parseFloat(match[1].replace(",", "."));
  if (!Number.isFinite(liters) || liters <= 0 || liters >= 10) return null;
  return Math.round(liters * 1000);
}

export function formatConsumption(kmPerLitre: number): string {
  const value = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(kmPerLitre);
  return `${value} km/l`;
}
