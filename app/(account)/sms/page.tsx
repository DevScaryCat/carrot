"use client";

import Image from "next/image";
import Input from "@/components/input";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { SMSVerification } from "./actions";

const initialState = {
    token: false,
    error: undefined,
};

export default function SMSLogin() {
    const [state, trigger] = useFormState(SMSVerification, initialState);

    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-semibold">
                <h1 className="text-2xl ">SMS Login</h1>
                <h2 className="text-xl ">Verify your phone number</h2>
            </div>
            <form action={trigger} className="flex flex-col gap-3 ">
                <Input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    required
                    errors={state.error?.formErrors}
                    readOnly={state.token}
                />
                {state.token ? (
                    <Input
                        type="number"
                        name="token"
                        placeholder="Verification Code"
                        required
                        min={100000}
                        max={999999}
                    />
                ) : null}
                <Button
                    name={
                        state.token ? "Verify Token" : "Send verification SMS"
                    }
                />
            </form>
            <div className="flex justify-center w-full">
                <Image
                    src="/images/sms/pepe_phone.png"
                    alt="pepe_phone"
                    width={200}
                    height={200}
                />
            </div>
        </div>
    );
}
