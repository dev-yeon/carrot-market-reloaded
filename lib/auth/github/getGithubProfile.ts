// interface IProfileResponse {
//   id: number;
//   name: string;
//   profile_photo: string;
// }

// export default async function getGithubPropfile(
//   access_token: string
// ): Promise<IProfileResponse> {
//   const userProfileResponse = await fetch("https://api.github.com/user", {
//       headers: {
//           Authorization: `Bearer ${access_token}`,
//       },
//       cache: "no-cache",
//   });
//   const profile = await userProfileResponse.json();

//   return {
//       id: profile.id,
//       name: profile.name,
//       profile_photo: profile.avatar_url,
//   };
// }

export default async function getGithubProfile(access_token: string) {
  // const profileUrl = "/api/github/user"; // 프록시 경로 사용
  const profileUrl = "https://api.github.com/user"; // GitHub API의 실제 URL

  try {
    const response = await fetch(profileUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch GitHub profile:", error);
      return { error };
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      profile_photo: data.avatar_url,
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return { error: "Unexpected error occurred" };
  }
}