import React from "react";
import "./Login.css";
import spotifyLogo from "./assets/logo.png";
import { getLoginUrl } from "./spotify";

function Login() {
  const handleLogin = async () => {
    const url = await getLoginUrl();

    window.location.href = url;
  };

  return (
    <div className="login">
      <img src={spotifyLogo} alt="Spotify" />

      <button onClick={handleLogin}>
        LOGIN WITH SPOTIFY
      </button>
    </div>
  );
}

export default Login;