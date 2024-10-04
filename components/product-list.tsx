"use client"
import { useState } from "react";
import { TInitiateProduct } from "@/app/(tabs)/products/page";
import ListProduct from "@/components/list-product";
import { getMoreProduts } from "@/app/(tabs)/products/actions";

interface IInitialProducts {
    initialProducts: TInitiateProduct;
}
export default function ProductList({ initialProducts }: IInitialProducts) {
    const [products, setProducts] = useState(initialProducts)
    const [isLoading, setIsLoading] = useState(false)
    const onLoadMoreClick = async () => {
        setIsLoading(true)
        const newProducts = await getMoreProduts(1)
        setProducts(prev => [...prev, ...newProducts])
        setIsLoading(false)
    }
    return (
        <div className="p-5 flex flex-col gap-5">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {
                isLoading ? "로딩중" : (
                    <button
                        onClick={onLoadMoreClick}
                        disabled={isLoading}
                        className="px-3 py-2 mx-auto text-sm font-semibold transition-all bg-green-500 rounded-md w-fit hover:opacity-90 active:scale-95 disabled:bg-gray-500">
                        Load more
                    </button>
                )
            }

        </div>
    )
}