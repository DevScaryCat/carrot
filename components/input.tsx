import { InputHTMLAttributes } from "react";

interface IInputProps {
    name: string;
    errors?: string[];
}

export default function Input({
    name,
    errors = [],
    ...extraProps
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                className="w-full h-10 transition bg-transparent border-none rounded-md focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-green-500 placeholder:text-neutral-400
                "
                name={name}
                {...extraProps}
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500 ">
                    {error}
                </span>
            ))}
        </div>
    );
}
