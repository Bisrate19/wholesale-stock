import "dotenv/config";
import { db } from "../lib/db";

const locations = [
  { name: "Warehouse", type: "WAREHOUSE" },
  { name: "Shop", type: "SHOP" },
  { name: "Wine car 1", type: "VEHICLE" },
  { name: "Wine car 2", type: "VEHICLE" },
] as const;

const products = [
  { name: "Red wine 75cl", category: "WINE", bottlesPerCrate: 12 },
  { name: "White wine 75cl", category: "WINE", bottlesPerCrate: 12 },
  { name: "Beer 33cl", category: "BEER", bottlesPerCrate: 24 },
  { name: "Beer 50cl", category: "BEER", bottlesPerCrate: 20 },
  { name: "Soft drink 30cl", category: "SOFT_DRINK", bottlesPerCrate: 24 },
  { name: "Spirit 70cl", category: "SPIRIT", bottlesPerCrate: 12 },
] as const;

async function main() {
  for (const l of locations) {
    await db.location.upsert({
      where: { name: l.name },
      update: {},
      create: l,
    });
  }
  for (const p of products) {
    await db.product.upsert({ where: { name: p.name }, update: {}, create: p });
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
