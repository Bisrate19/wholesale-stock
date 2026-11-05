import { db } from "@/lib/db";
import { addProduct } from "./actions";

export const dynamic = "force-dynamic";

const categoryNames = {
  BEER: "Beer",
  WINE: "Wine",
  SOFT_DRINK: "Soft drinks",
  SPIRIT: "NATIONAL_ALCHOL",
} as const;

const errors = {
  invalid: "Enter a name, pick a category, and use a whole number of bottles per crate.",
  exists: "A product with that name already exists.",
} as const;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  const categories = Object.keys(categoryNames) as (keyof typeof categoryNames)[];
  const field = "w-full rounded border border-gray-300 p-2";

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>

      <form action={addProduct} className="mb-8 space-y-3 rounded border p-4">
        <h2 className="font-medium">Add product</h2>
        {error && error in errors && (
          <p className="text-red-700">{errors[error as keyof typeof errors]}</p>
        )}
        <label className="block">
          Name
          <input name="name" required className={field} />
        </label>
        <div className="flex gap-3">
          <label className="block flex-1">
            Category
            <select name="category" className={field}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryNames[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1">
            Bottles per crate
            <input
              name="bottlesPerCrate"
              type="number"
              min="1"
              defaultValue="24"
              className={field}
            />
          </label>
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white">
          Add product
        </button>
      </form>

      {categories.map((c) => {
        const rows = products.filter((p) => p.category === c);
        return (
          <section key={c} className="mb-6">
            <h2 className="mb-2 text-lg font-medium">
              {categoryNames[c]} ({rows.length})
            </h2>
            {rows.length === 0 ? (
              <p className="text-gray-500">None yet.</p>
            ) : (
              <ul>
                {rows.map((p) => (
                  <li key={p.id} className="flex justify-between border-b py-2">
                    <span>{p.name}</span>
                    <span className="text-gray-500">
                      {p.bottlesPerCrate} per crate
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}