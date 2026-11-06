import "dotenv/config";
import { db } from "../lib/db";

const locations = [
  { name: "Warehouse", type: "WAREHOUSE" },
  { name: "Shop", type: "SHOP" },
  { name: "Wine car 1", type: "VEHICLE" },
  { name: "Wine car 2", type: "VEHICLE" },
] as const;

const categories = ["Beer", "Wine", "Soft drinks", "National alcohol"];

async function main() {
  for (const l of locations) {
    await db.location.upsert({
      where: { name: l.name },
      update: {},
      create: l,
    });
  }
  for (const name of categories) {
    await db.category.upsert({ where: { name }, update: {}, create: { name } });
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
