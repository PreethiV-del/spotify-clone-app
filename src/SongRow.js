import React from "react";
import "./SongRow.css";

function SongRow({ track, onPlayTrack }) {
  const handleClick = () => {
    if (!track?.uri) {
      console.error("This song doesn't have a Spotify URI:", track);
      return;
    }

    onPlayTrack?.(track.uri);
  };

  return (
    <div
      className="songRow"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <img
        className="songRow__album"
        src={track?.album?.images?.[0]?.url || ""}
        alt={track?.name || ""}
      />

      <div className="songRow__info">
        <h1>{track?.name || "Unknown song"}</h1>

        <p>
          {track?.artists?.map((artist) => artist.name).join(", ")}
          {" - "}
          {track?.album?.name || "Unknown album"}
        </p>
      </div>
    </div>
  );
}

export default SongRow;
