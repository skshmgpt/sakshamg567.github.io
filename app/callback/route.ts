import { NextRequest, NextResponse } from "next/server";

function page(title: string, body: string, status = 200) {
  return new NextResponse(
    `<html><body style="background:#0D0D0D;color:#F0F0EB;font-family:monospace;padding:40px;max-width:640px;margin:0 auto">
      <h1 style="color:#FF4141;font-size:18px">${title}</h1>
      ${body}
    </body></html>`,
    { status, headers: { "content-type": "text/html" } }
  );
}

function successPage(refreshToken: string) {
  return new NextResponse(
    `<html><body style="background:#0D0D0D;color:#F0F0EB;font-family:monospace;padding:40px;max-width:640px;margin:0 auto">
      <h1 style="color:#00FF41;font-size:18px">authorization successful</h1>
      <p style="color:#889988;font-size:13px">copy this refresh token:</p>
      <div style="background:#111110;border:1px solid #00FF41;padding:16px;margin:12px 0;word-break:break-all">
        <code style="color:#00FF41;font-size:13px">${refreshToken}</code>
      </div>
      <p style="color:#889988;font-size:12px">add it to .env.local as SPOTIFY_REFRESH_TOKEN</p>
      <p style="color:#1F1F1C;font-size:11px">you can close this page now</p>
    </body></html>`,
    { headers: { "content-type": "text/html" } }
  );
}

function getOrigin(request: NextRequest) {
  // When behind Cloudflare Tunnel or reverse proxy, reconstruct the
  // external origin from forwarded headers instead of localhost:3000.
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return page(
      "missing credentials",
      `<p style="color:#889988;font-size:13px">SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are not set in .env.local.</p>
       <p style="color:#889988;font-size:13px">add them and restart the dev server.</p>`,
      500
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return page(
      "no code",
      `<p style="color:#889988;font-size:13px">no authorization code found in the url. make sure you visited the spotify authorization url correctly.</p>`
    );
  }

  const origin = getOrigin(request);
  const redirectUri = `${origin}/callback`;

  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("spotify token exchange failed:", data);
      return page(
        `token exchange failed (${res.status})`,
        `<p style="color:#889988;font-size:13px">spotify error: <strong>${data.error_description ?? data.error ?? "unknown"}</strong></p>
         <p style="color:#889988;font-size:12px">redirect_uri used: <code>${redirectUri}</code></p>
         <pre style="color:#889988;background:#111110;padding:12px;border:1px solid #1F1F1C;font-size:11px;overflow-x:auto">${JSON.stringify(data, null, 2)}</pre>`,
        400
      );
    }

    if (data.refresh_token) {
      return successPage(data.refresh_token);
    }

    // No refresh_token in response — you may have already authorized before.
    // Spotify only includes refresh_token the first time.
    return page(
      "no refresh token returned",
      `<p style="color:#889988;font-size:13px">spotify only sends the refresh_token on the <strong>first</strong> authorization.</p>
       <p style="color:#889988;font-size:13px">you may have already authorized this app before. go to your <a href="https://www.spotify.com/account/apps/" style="color:#00FF41">spotify account apps page</a>, remove this app, then try again.</p>
       <pre style="color:#889988;background:#111110;padding:12px;border:1px solid #1F1F1C;font-size:11px;overflow-x:auto">${JSON.stringify(data, null, 2)}</pre>`
    );
  } catch (error) {
    console.error("callback error:", error);
    return page(
      "unexpected error",
      `<p style="color:#889988;font-size:13px">check the server logs for details.</p>`,
      500
    );
  }
}
