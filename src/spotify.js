export const authEndpoint =
  "https://accounts.spotify.com/authorize";

export const tokenEndpoint =
  "https://accounts.spotify.com/api/token";

const redirectUri =
  "http://127.0.0.1:3000/";

const clientId =
  "09f29cc3fcc04a4e818747abb74fde4f";

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
];

const generateCodeVerifier = (length = 128) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const randomValues = new Uint8Array(length);

  window.crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map(
      (value) =>
        characters[value % characters.length]
    )
    .join("");
};

const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(
    codeVerifier
  );

  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    data
  );

  return btoa(
    String.fromCharCode(
      ...new Uint8Array(digest)
    )
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const getLoginUrl = async () => {
  const codeVerifier = generateCodeVerifier();

  const codeChallenge =
    await generateCodeChallenge(codeVerifier);

  // Store verifier before redirecting to Spotify
  sessionStorage.setItem(
    "spotify_code_verifier",
    codeVerifier
  );

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    show_dialog: "true",
  });

  return `${authEndpoint}?${params.toString()}`;
};

export const getTokenFromUrl = async () => {
  const params = new URLSearchParams(
    window.location.search
  );

  const code = params.get("code");
  const error = params.get("error");

  if (error) {
    console.error(
      "Spotify authorization error:",
      error
    );

    return null;
  }

  if (!code) {
    return null;
  }

  // Get the exact verifier used before redirecting
  const codeVerifier = sessionStorage.getItem(
    "spotify_code_verifier"
  );

  if (!codeVerifier) {
    console.error(
      "Spotify code verifier not found."
    );

    return null;
  }

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    console.log("🎟️ GRANTED SPOTIFY SCOPE:", data.scope);

    if (!response.ok) {
      console.error(
        "Spotify token error:",
        data
      );

      return null;
    }

    // Verifier is no longer needed
    sessionStorage.removeItem(
      "spotify_code_verifier"
    );

    // Remove ?code=... from URL
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    return data.access_token;
  } catch (error) {
    console.error(
      "Token request failed:",
      error
    );

    return null;
  }
};