import React from "react";
import "./Body.css";
import Header from "./Header";
import { useDataLayerValue } from "./DataLayer";

import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SongRow from "./SongRow";

function Body({ spotify, onPlayTrack }) {
  const [{ discover_weekly }] = useDataLayerValue();

  console.log("PLAYLIST IN BODY:", discover_weekly);

  console.log("PLAYLIST IMAGE:", discover_weekly?.images);

  console.log("PLAYLIST ITEMS:", discover_weekly?.items?.items);

  return (
    <div className="body">
      <Header spotify={spotify} />

      <div className="body__info">
        {discover_weekly?.images?.length > 0 && (
          <img
            src={discover_weekly.images[0].url}
            alt={discover_weekly.name}
            className="body__infoImage"
          />
        )}

        <div className="body__infoText">
          <strong>PLAYLIST</strong>

          <h2>{discover_weekly?.name || "My Playlist #4"}</h2>

          <p>
            {discover_weekly?.description || "Your Spotify playlist"}
          </p>
        </div>
      </div>

      <div className="body__songs">
        <div className="body__icons">
          <PlayCircleFilledWhiteOutlinedIcon
            className="body__shuffle"
          />

          <FavoriteIcon fontSize="large" />

          <MoreHorizIcon />
        </div>

        {discover_weekly?.items?.items?.map((item, index) => {
          const track = item?.item;

          if (!track) {
            return null;
          }

          return (
            <SongRow
              key={track.id || index}
              track={track}
              onPlayTrack={onPlayTrack}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Body;