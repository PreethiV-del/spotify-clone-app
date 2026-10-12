import React, { useCallback, useState } from "react";
import "./Player.css";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Footer from "./Footer";
import SpotifyPlayer from "./spotifyplayer";

function Player({ spotify, token }) {
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true);

  const handlePlayerReady = useCallback(({ deviceId }) => {
    setDeviceId(deviceId);
  }, []);

  const handleTrackChange = useCallback(({ track, isPaused }) => {
    setCurrentTrack(track);
    setIsPaused(isPaused);
  }, []);

  const playTrack = useCallback(
    async (trackUri) => {
      if (!deviceId || !token || !trackUri) {
        console.warn("Player isn't ready, or the track URI is missing.");
        return;
      }

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [trackUri] }),
          }
        );

        if (!response.ok) {
          const details = await response.json().catch(() => ({}));
          console.error("Unable to play track:", response.status, details);
        }
      } catch (error) {
        console.error("Playback request failed:", error);
      }
    },
    [deviceId, token]
  );

  return (
    <div className="player">
      <SpotifyPlayer
        token={token}
        onPlayerReady={handlePlayerReady}
        onTrackChange={handleTrackChange}
      />

      <div className="player__body">
        <Sidebar />
        <Body spotify={spotify} onPlayTrack={playTrack} />
      </div>

      <Footer
        currentTrack={currentTrack}
        isPaused={isPaused}
      />
    </div>
  );
}

export default Player;