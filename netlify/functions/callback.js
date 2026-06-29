// Step 2 of the GitHub login: exchange the code for an access token, then hand
// it back to the Decap CMS window using the postMessage handshake it expects.

export const handler = async (event) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const code = event.queryStringParameters?.code;

  if (!clientId || !clientSecret) {
    return renderResult("error", { message: "Missing OAuth env vars on Netlify" });
  }
  if (!code) {
    return renderResult("error", { message: "No code returned from GitHub" });
  }

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = await res.json();

    if (data.error || !data.access_token) {
      return renderResult("error", { message: data.error_description || data.error || "No token" });
    }

    return renderResult("success", { token: data.access_token, provider: "github" });
  } catch (err) {
    return renderResult("error", { message: String(err) });
  }
};

function renderResult(status, content) {
  const payload = JSON.stringify(content);
  const body = `<!doctype html><html><body><script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:${status}:${payload}',
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
  </script></body></html>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body,
  };
}
