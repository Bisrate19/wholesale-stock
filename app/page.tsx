import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Wholesale Stock</h1>
      <Link href="/receive" className="underline">
        Receive stock
      </Link>
      <Link href="/stock" className="underline">
        See stock
      </Link>
      <Link href="/products" className="underline">
        Products
      </Link>
    </main>
  );
}
