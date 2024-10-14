"use server";

import PrismaDB from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await PrismaDB.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: 20,
    take: 20,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
