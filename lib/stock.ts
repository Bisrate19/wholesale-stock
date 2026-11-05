import { db } from "./db";

type ReceiveInput = {
  productId: string;
  locationId: string;
  crates: number;
  bottles: number;
  note?: string;
};

export async function receiveStock(input: ReceiveInput) {
  const { productId, locationId, crates, bottles, note } = input;

  if (
    !Number.isInteger(crates) ||
    !Number.isInteger(bottles) ||
    crates < 0 ||
    bottles < 0
  ) {
    throw new Error("Crates and bottles must be whole numbers, 0 or more.");
  }

  return db.$transaction(async (tx) => {
    const product = await tx.product.findUniqueOrThrow({
      where: { id: productId },
    });
    const total = crates * product.bottlesPerCrate + bottles;
    if (total <= 0) throw new Error("Enter a quantity greater than zero.");

    await tx.stockMovement.create({
      data: {
        type: "RECEIVE",
        quantity: total,
        note,
        productId,
        toLocationId: locationId,
      },
    });

    await tx.stockLevel.upsert({
      where: { productId_locationId: { productId, locationId } },
      update: { quantity: { increment: total } },
      create: { productId, locationId, quantity: total },
    });

    return total;
  });
}
