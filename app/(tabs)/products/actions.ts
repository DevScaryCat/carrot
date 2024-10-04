"use server";

import PrismaDB from "@/lib/db";

export async function getMoreProduts(page: number) {
  const products = await PrismaDB.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: 1,
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
