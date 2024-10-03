import ListProduct from "@/components/list-Product";
import PrismaDB from "@/lib/db";

async function getProduct() {
    const products = await PrismaDB.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            created_at: true,
            photo: true,
        }
    })
    return products
}
export default async function Products() {
    const products = await getProduct();
    return (
        <div className="p-5 flex flex-col gap-5">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
        </div>
    );
}