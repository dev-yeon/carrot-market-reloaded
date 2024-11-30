

export function GET() {
  console.log('github start');
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID,
    // redi
  }
}