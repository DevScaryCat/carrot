"use client"
import { useRouter } from "next/navigation";

export default function CloseBg() {
    const router = useRouter();
    function onCloseClick() {
        router.back();
    }
    return (
        <button onClick={onCloseClick} className="fixed cursor-default w-screen h-screen top-0 left-0 -z-10 flex justify-center items-center bg-black bg-opacity-30"></button>
    )
}