// The name of `route.ts` is kinda reserved name,
// So, we can handle specific HTTP methods(like a GET or POST) of URL with route.ts file

import { redirect } from "next/navigation";

export function GET() {
    const RequestURL = "https://github.com/login/oauth/authorize";
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope: "read:user,user:email",
        allow_signup: "true",
    };
    const formattedParams = new URLSearchParams(params).toString();
    const URL = `${RequestURL}?${formattedParams}`;
    return redirect(URL);
}
