// Step 1 of the GitHub login: send the admin user to GitHub to authorize.
import { randomBytes } from "node:crypto";

export const handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: "Missing OAUTH_CLIENT_ID env var" };
  }

  const host = event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state: randomBytes(12).toString("hex"),
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
    },
  };
};
