import PrismaDB from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import UpdateSession from "@/lib/session/updateSession";
import getAccessToken from "@/lib/auth/github/getAccessToken";
import getGithubPropfile from "@/lib/auth/github/getGithubProfile";
import getGithubEmail from "@/lib/auth/github/getGithubEmail";
import isExistUsername from "@/lib/auth/isExistUsername";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const email = await getGithubEmail(access_token);
  const { id, name, profile_photo } = await getGithubPropfile(access_token);

  const user = await PrismaDB.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await UpdateSession(user.id);
    return redirect("/profile");
  }
  const isExist = await isExistUsername(name);
  const newUser = await PrismaDB.user.create({
    data: {
      github_id: id + "",
      avatar: profile_photo,
      username: isExist ? `${name}-gh` : name,
    },
    select: {
      id: true,
    },
  });
  await UpdateSession(newUser.id);
  return redirect("/profile");
}
