"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/products?error=invalid-category");

  const exists = await db.category.findUnique({ where: { name } });
  if (exists) redirect("/products?error=category-exists");

  await db.category.create({ data: { name } });
  revalidatePath("/products");
  redirect("/products");
}

export async function addProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const bottlesPerCrate = Number(formData.get("bottlesPerCrate"));

  if (
    !name ||
    !categoryId ||
    !Number.isInteger(bottlesPerCrate) ||
    bottlesPerCrate < 1
  ) {
    redirect("/products?error=invalid");
  }

  const exists = await db.product.findUnique({ where: { name } });
  if (exists) redirect("/products?error=exists");

  await db.product.create({ data: { name, categoryId, bottlesPerCrate } });
  revalidatePath("/products");
  redirect("/products");
}
