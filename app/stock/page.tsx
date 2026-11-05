import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const levels = await db.stockLevel.findMany({
    include: { product: true, location: true },
    orderBy: [{ location: { name: "asc" } }, { product: { name: "asc" } }],
  });

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Stock</h1>
      {levels.length === 0 ? (
        <p>No stock yet. Receive some first.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Location</th>
              <th>Product</th>
              <th>Crates</th>
              <th>Bottles</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.id} className="border-b">
                <td className="py-2">{l.location.name}</td>
                <td>{l.product.name}</td>
                <td>{Math.floor(l.quantity / l.product.bottlesPerCrate)}</td>
                <td>{l.quantity % l.product.bottlesPerCrate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
