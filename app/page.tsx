import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">FEELFIT MVP</h1>
      <p className="opacity-70">Open a sample product route to see the Learn More flow.</p>
      <Link className="px-4 py-2 rounded-full bg-black text-white" href="/product/your-product-uuid">
        Go to Product (replace id)
      </Link>
    </main>
  );
}
