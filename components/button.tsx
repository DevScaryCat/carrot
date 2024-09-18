"use client";

import { useFormStatus } from "react-dom";

interface IButton {
    name: string;
}

export default function Button({ name }: IButton) {
    const { pending } = useFormStatus();

    return (
        <button
            className="h-10 font-medium primary-button disabled:bg-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={pending}
        >
            {pending ? "Loading" : name}
        </button>
    );
}
