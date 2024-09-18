import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-6">
            <div className=" gap-2 my-auto *:font-medium flex flex-col items-center">
                <span className=" text-9xl">🐸</span>
                {/* <Image
                    src="/images/home/feel_good_man.png"
                    alt="feel_good_man"
                    width={150}
                    height={200}
                /> */}
                <h1 className="text-4xl ">PEPE</h1>
                <h2 className="text-2xl">Welcome to Pepe market!</h2>
            </div>

            <div className="flex flex-col items-center w-full gap-3">
                <Link
                    href="/create-account"
                    className="primary-button py-2.5 font-semibold"
                >
                    Create
                </Link>
                <div className="flex gap-2">
                    <span>Already have an account?</span>
                    <Link href="/login" className=" hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
