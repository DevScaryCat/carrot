interface IProfileResponse {
  id: number;
  name: string;
  profile_photo: string;
}

export default async function getGithubPropfile(access_token: string): Promise<IProfileResponse> {
  console.log(access_token);
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const profile = await userProfileResponse.json();
  return {
    id: profile.id,
    name: profile.name,
    profile_photo: profile.avatar_url,
  };
}
