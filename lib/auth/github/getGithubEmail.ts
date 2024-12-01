// 

export default async function getGithubEmail(access_token: string) {
    // const emailUrl = "/api/github/user/emails"; // 프록시 경로 사용
    const emailUrl = "https://api.github.com/user/emails"; // GitHub API의 실제 URL
    try {
      const response = await fetch(emailUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to fetch GitHub email:", error);
        return { error };
      }
  
      const emails = await response.json();
      const primaryEmail = emails.find((email: any) => email.primary)?.email;
  
      return primaryEmail || null;
    } catch (error) {
      console.error("Error fetching GitHub email:", error);
      return null;
    }
  }