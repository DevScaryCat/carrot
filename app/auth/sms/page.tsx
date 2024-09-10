"use client"
import Button from "@/components/common/btn";
import Input from "@/components/common/input";
import { CODE_MAX_LENGTH, CODE_MIN_LENGTH } from "@/lib/constants";
import { useFormState } from "react-dom";
import { smsSignIn } from "./actions";


const initialState = {
    code: false,
    error: undefined,
}

export default function SMSLogin() {
    const [state, dispatch] = useFormState(smsSignIn, initialState)
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMS Log in</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                {state.code ? (
                    <Input
                        name="code"
                        key="code"
                        type="number"
                        placeholder="Verification code"
                        required
                        min={CODE_MIN_LENGTH}
                        max={CODE_MAX_LENGTH}
                    />
                ) : (
                    <Input
                        name="phoneNumber"
                        key="phoneNumber"
                        type="text"
                        placeholder="Phone number"
                        required
                        errors={state.error?.formErrors}
                    />
                )}
                <Button text={state.code ? "Verify Token" : "Send Verification SMS"} />
            </form>
        </div>
    );
}