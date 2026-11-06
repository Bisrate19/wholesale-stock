import { db } from "@/lib/db";
import { addCategory, addProduct } from "./actions";

export const dynamic = "force-dynamic";

const errors = {
  invalid:
    "Enter a name, pick a category, and use a whole number of bottles per crate.",
  exists: "A product with that name already exists.",
  "invalid-category": "Enter a category name.",
  "category-exists": "That category already exists.",
} as const;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    include: {
      products: { where: { active: true }, orderBy: { name: "asc" } },
    },
  });
  const field = "w-full rounded border border-gray-300 p-2";

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>

      {error && error in errors && (
        <p className="mb-4 text-red-700">
          {errors[error as keyof typeof errors]}
        </p>
      )}

      <form action={addCategory} className="mb-4 flex gap-3 rounded border p-4">
        <input
          name="name"
          placeholder="New category name"
          required
          className={field}
        />
        <button className="rounded bg-gray-900 px-4 py-2 whitespace-nowrap text-white">
          Add category
        </button>
      </form>

      <form action={addProduct} className="mb-8 space-y-3 rounded border p-4">
        <h2 className="font-medium">Add product</h2>
        <label className="block">
          Name
          <input name="name" required className={field} />
        </label>
        <div className="flex gap-3">
          <label className="block flex-1">
            Category
            <select name="categoryId" required className={field}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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

      {categories.map((c) => (
        <section key={c.id} className="mb-6">
          <h2 className="mb-2 text-lg font-medium">
            {c.name} ({c.products.length})
          </h2>
          {c.products.length === 0 ? (
            <p className="text-gray-500">None yet.</p>
          ) : (
            <ul>
              {c.products.map((p) => (
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
      ))}
    </main>
  );
}
