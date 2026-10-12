import React from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./Footer.css";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import musicImage from "./assets/music.png";

function Footer({ currentTrack, isPaused }) {
  const songTitle = currentTrack?.name || "No song playing";

  const artistNames =
    currentTrack?.artists?.map((artist) => artist.name).join(", ") || "";

  const albumImage =
    currentTrack?.image?.[0]?.url ||
    currentTrack?.album?.images?.[0]?.url ||
    musicImage;

  return (
    <div className="footer">
      <div className="footer__left">
        <img
          className="footer__musicImage"
          src={albumImage}
          alt={songTitle}
        />

        <div className="footer__songInfo">
          <h4>{songTitle}</h4>
          <p>{artistNames}</p>
        </div>

        {currentTrack && (
          <CheckCircleIcon className="footer__green" />
        )}
      </div>

      <div className="footer__center">
        <ShuffleIcon className="footer__green" />

        <SkipPreviousIcon className="footer__icon" />

        {isPaused ? (
          <PlayCircleIcon
            fontSize="large"
            className="footer__icon"
          />
        ) : (
          <PauseCircleFilledIcon
            fontSize="large"
            className="footer__icon"
          />
        )}

        <SkipNextIcon className="footer__icon" />

        <RepeatIcon className="footer__green" />
      </div>

      <div className="footer__right">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <PlaylistPlayIcon />
          </Grid>

          <Grid item>
            <VolumeDownIcon />
          </Grid>

          <Grid item xs>
            <Slider aria-label="Volume" defaultValue={50} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Footer;