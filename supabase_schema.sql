-- Run in Supabase SQL editor

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete cascade,
  name text not null,
  price_cents int not null,
  currency text not null default 'USD',
  description text,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table if not exists public.product_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  storage_path text not null,
  mime_type text not null default 'image/webp',
  width int,
  height int,
  aspect_ratio numeric,
  dominant_color text,
  blur_hash text,
  role text not null default 'gallery',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists product_assets_idx on public.product_assets(product_id, role, sort_order);

alter table public.products enable row level security;
create policy if not exists read_products on public.products for select using (true);

alter table public.product_assets enable row level security;
create policy if not exists read_assets on public.product_assets for select using (true);

-- RPC: more from brand
create or replace function public.more_from_brand(p_product_id uuid, p_limit int default 6)
returns table (
  id uuid,
  name text,
  price_cents int,
  storage_path text
) language sql stable as $$
  select p.id, p.name, p.price_cents, pa.storage_path
  from products p
  join product_assets pa on pa.product_id = p.id and pa.role in ('hero','gallery')
  where p.brand_id = (select brand_id from products where id = p_product_id)
    and p.id <> p_product_id
    and pa.is_active = true
  group by p.id, pa.storage_path
  order by p.created_at desc
  limit p_limit;
$$;
