export type Brand = { id: string; name: string; slug: string };
export type Asset = { storage_path: string; role: string; sort_order: number | null };
export type Product = {
  id: string;
  name: string;
  price_cents: number;
  brand: Brand;
  assets: Asset[];
};
