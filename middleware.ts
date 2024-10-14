import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/getSession";

interface IPublicURL {
  [key: string]: boolean;
}

const publicURLs: IPublicURL = {
  "/": true,
  "/sms": true,
  "/login": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isPublicPath = publicURLs[request.nextUrl.pathname];

  if (!session.id) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
