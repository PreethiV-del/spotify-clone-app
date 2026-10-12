import React, { useEffect, useState } from "react";

function SpotifyPlayer({ token, onPlayerReady, onTrackChange }) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [status, setStatus] = useState("Loading Spotify player...");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let spotifyPlayer = null;

    const initializePlayer = () => {
      if (cancelled || !window.Spotify || spotifyPlayer) return;

      spotifyPlayer = new window.Spotify.Player({
        name: "My Spotify Clone",
        getOAuthToken: (callback) => callback(token),
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        if (cancelled) return;

        setDeviceId(device_id);
        setStatus("Spotify player ready!");
        onPlayerReady?.({ deviceId: device_id, token });
      });

      spotifyPlayer.addListener("not_ready", () => {
        if (!cancelled) {
          setDeviceId(null);
          setStatus("Spotify player disconnected.");
        }
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        if (!cancelled) setStatus(`Initialization error: ${message}`);
        console.error(message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        if (!cancelled) setStatus(`Authentication error: ${message}`);
        console.error(message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        if (!cancelled) setStatus(`Account error: ${message}`);
        console.error(message);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state || cancelled) return;

        const track = state.track_window.current_track;
        const paused = state.paused;

        setCurrentTrack(track);
        setIsPaused(paused);

        onTrackChange?.({
          track: track
            ? {
                ...track,
                image: track.album?.images || [],
              }
            : null,
          isPaused: paused,
        });
      });

      spotifyPlayer.connect().then((connected) => {
        if (!connected && !cancelled) {
          setStatus("Could not connect. Refresh and try again.");
        }
      }).catch((error) => {
        if (!cancelled) setStatus("Could not connect to Spotify.");
        console.error("Spotify connection error:", error);
      });
    };

    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    if (window.Spotify) {
      initializePlayer();
    } else {
      let script = document.querySelector(
        'script[src="https://sdk.scdn.co/spotify-player.js"]'
      );

      if (!script) {
        script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;

      if (spotifyPlayer) {
        spotifyPlayer.disconnect();
      }

      if (window.onSpotifyWebPlaybackSDKReady === initializePlayer) {
        window.onSpotifyWebPlaybackSDKReady = undefined;
      }
    };
  }, [token, onPlayerReady, onTrackChange]);

  const togglePlayback = async () => {
    if (!player || !deviceId) return;

    try {
      await player.togglePlay();
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  return (
    <div
      style={{
        background: "#181818",
        color: "white",
        padding: "12px 20px",
      }}
    >
      <p>{status}</p>

      {currentTrack && (
        <p>
          Now playing: {currentTrack.name} —{" "}
          {currentTrack.artists.map((artist) => artist.name).join(", ")}
        </p>
      )}

      <button onClick={togglePlayback} disabled={!deviceId}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
}

export default SpotifyPlayer;