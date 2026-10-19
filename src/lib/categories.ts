export interface CarCategory {
  name: string;
  slug: string;
  tagline: string;
  count: number;
  image: string | null;
  url: string;
  filter: { key: string; value: string };
}
