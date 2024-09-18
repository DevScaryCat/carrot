import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";

export default function SocialLogin() {
    return (
        <>
            <div className="w-full h-px bg-neutral-500" />
            <div className="flex flex-col gap-3">
                <Link
                    href="/github/start"
                    className="flex items-center justify-center h-10 gap-3 primary-button"
                >
                    <FaGithub size={24} />
                    <span>Continue with Github</span>
                </Link>
                <Link
                    href="/sms"
                    className="flex items-center justify-center h-10 gap-3 primary-button"
                >
                    <AiFillMessage size={24} />
                    <span>Continue with SMS</span>
                </Link>
            </div>
        </>
    );
}
