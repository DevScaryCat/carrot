import PrismaDB from "@/lib/db";
import getSession from "@/lib/session/getSession";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
    const session = await getSession()
    if (session.id) return session.id === userId
    else return false
}

async function getProduct(id: number) {
    const product = await PrismaDB.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return product;
}



export default async function ProductDetail({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id)
    if (isNaN(id)) return notFound();
    const product = await getProduct(id);
    if (!product) return notFound()
    const isOwner = await getIsOwner(product.userId)
    const onDelete = async () => {
        "use server"
        if (!isOwner) return
        const url = new URL(product.photo);
        const path = url.pathname;
        const photoId = path.split('/').pop();
        const cloudflareDeletePromise = fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${photoId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                },
            }
        );
        const prismaDeletePromise = PrismaDB.product.delete({
            where: {
                id,
            },
            select: null,
        });
        await Promise.all([cloudflareDeletePromise, prismaDeletePromise]);
        redirect("/products");
    }

    return (
        <div className="pb-40">
            <div className="relative aspect-square">
                <Image fill src={`${product.photo}/public`} className=" object-cover" alt={product.title} />
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 rounded-full">
                    {product.user.avatar !== null ? (
                        <Image
                            src={product.user.avatar}
                            width={40}
                            height={40}
                            alt={product.user.username}
                        />
                    ) : (
                        <UserIcon />
                    )}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed w-full bottom-0 max-w-screen-sm p-5 pb-10 bg-neutral-800 flex justify-between items-center">
                <span className="font-semibold text-xl">
                    {formatToWon(product.price)}원
                </span>
                {isOwner ? (
                    <form action={onDelete}>
                        <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                            Delete product
                        </button>
                    </form>
                ) : null}
                <Link
                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    href={``}
                >
                    채팅하기
                </Link>
            </div>
        </div>
    );
}