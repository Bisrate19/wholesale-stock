"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const categories = ["BEER", "WINE", "SOFT_DRINK", "SPIRIT"] as const;
type Category = (typeof categories)[number];

export async function addProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const bottlesPerCrate = Number(formData.get("bottlesPerCrate"));

  if (
    !name ||
    !categories.includes(category) ||
    !Number.isInteger(bottlesPerCrate) ||
    bottlesPerCrate < 1
  ) {
    redirect("/products?error=invalid");
  }

  const exists = await db.product.findUnique({ where: { name } });
  if (exists) redirect("/products?error=exists");

  await db.product.create({ data: { name, category, bottlesPerCrate } });
  revalidatePath("/products");
  redirect("/products");
}
