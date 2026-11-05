import { db } from "@/lib/db";
import { receiveAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReceivePage() {
  const [products, locations] = await Promise.all([
    db.product.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.location.findMany({ where: { type: "WAREHOUSE" } }),
  ]);

  const field = "w-full rounded border border-gray-300 p-2";

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-semibold">Receive stock</h1>
      <form action={receiveAction} className="space-y-4">
        <label className="block">
          Product
          <select name="productId" required className={field}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Into
          <select name="locationId" required className={field}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3">
          <label className="block flex-1">
            Crates
            <input
              name="crates"
              type="number"
              min="0"
              defaultValue="0"
              className={field}
            />
          </label>
          <label className="block flex-1">
            Extra bottles
            <input
              name="bottles"
              type="number"
              min="0"
              defaultValue="0"
              className={field}
            />
          </label>
        </div>
        <label className="block">
          Note (optional)
          <input name="note" className={field} />
        </label>
        <button className="w-full rounded bg-gray-900 p-3 text-white">
          Save
        </button>
      </form>
    </main>
  );
}
