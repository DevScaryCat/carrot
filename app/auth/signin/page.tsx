"use client"
import Button from "@/components/common/btn";
import Input from "@/components/common/input";
import SocialLogin from "@/components/auth/social-login";
import { signIn } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useFormState } from "react-dom";

export default function Signin() {
    const [state, dispatch] = useFormState(signIn, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Sign in with email and password.</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input name="email" type="email" placeholder="Email" required errors={state?.fieldErrors.email} />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.password}
                />
                <Button text="Sign in" />
            </form>
            <SocialLogin />
        </div>
    );
}