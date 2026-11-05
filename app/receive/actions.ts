"use server";

import { redirect } from "next/navigation";
import { receiveStock } from "@/lib/stock";

export async function receiveAction(formData: FormData) {
  await receiveStock({
    productId: String(formData.get("productId") ?? ""),
    locationId: String(formData.get("locationId") ?? ""),
    crates: Number(formData.get("crates") || 0),
    bottles: Number(formData.get("bottles") || 0),
    note: String(formData.get("note") ?? "").trim() || undefined,
  });
  redirect("/stock");
}
