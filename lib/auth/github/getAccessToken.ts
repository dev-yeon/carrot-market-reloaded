// export default async function getAccessToken(code: string) {
//   let accessTokenURL = "https://github.com/login/oauth/access_token";

//   const accessTokenParams = new URLSearchParams({
//       client_id: process.env.GITHUB_CLIENT_ID!,
//       client_secret: process.env.GITHUB_CLIENT_SECRET_KEY!,
//       code: code,
//   }).toString();

//   accessTokenURL = `${accessTokenURL}?${accessTokenParams}`;

//   const { error, access_token } = await (
//       await fetch(accessTokenURL, {
//           method: "POST",
//           headers: {
//               Accept: "application/json",
//           },
//       })
//   ).json();

//   return { error, access_token };
// }
export default async function getAccessToken(code: string) {
  // const tokenUrl = `${process.env.REDIRECT_URI}/api/github/login/oauth/access_token`; // 프록시 경로 사용
  const tokenUrl = "https://github.com/login/oauth/access_token";
    const clientId = process.env.GITHUB_CLIENT_ID!;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
    const redirectUri = `${process.env.REDIRECT_URI}/github/complete`;
    console.log("Client ID:", clientId);
    console.log("Client Secret:", clientSecret);
    console.log("Redirect URI:", redirectUri);
  
    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to fetch access token:", error);
        return { error };
      }
  
      const data = await response.json();
      return { access_token: data.access_token };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching access token:", errorMessage);
      return { error: errorMessage || "Unexpected error occurred" };
    }
  }