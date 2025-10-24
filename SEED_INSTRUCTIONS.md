1) Create Storage bucket: `product-images` (public for MVP).
2) Upload images to paths like:
   - product-images/brand-slug/<product_uuid>/hero-0.webp
   - product-images/brand-slug/<product_uuid>/gallery-1.webp
3) Insert sample rows into `brands`, `products`, `product_assets` using those paths.
4) Copy `.env.example` to `.env.local` and fill your Supabase credentials.
5) `npm i && npm run dev`, then open `/product/<your-product-uuid>`.
