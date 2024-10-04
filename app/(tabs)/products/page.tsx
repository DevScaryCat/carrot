import ProductList from "@/components/product-list";
import PrismaDB from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
    const products = await PrismaDB.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

export type TInitiateProduct = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
        </div>
    );
}