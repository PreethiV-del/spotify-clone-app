import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

function App() {
  const [{ token }, dispatch] = useDataLayerValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const _token = await getTokenFromUrl();

        if (!_token) {
          setLoading(false);
          return;
        }

        dispatch({
          type: "SET_TOKEN",
          token: _token,
        });

        spotify.setAccessToken(_token);

        // Get current user
        const currentUser = await spotify.getMe();

        dispatch({
          type: "SET_USER",
          user: currentUser,
        });

        // Get playlists
        const playlists = await spotify.getUserPlaylists();

        dispatch({
          type: "SET_PLAYLISTS",
          playlists,
        });

        // Find My Playlist #4
        const myPlaylist = playlists.items.find(
          (playlist) => playlist.name === "My Playlist #4"
        );

        if (!myPlaylist) {
          console.log("My Playlist #4 was not found");
          return;
        }

        // Get playlist metadata
        const playlistDetails = await spotify.getPlaylist(
          myPlaylist.id
        );

        // Get playlist items
        const itemsUrl = `https://api.spotify.com/v1/playlists/${myPlaylist.id}/items`;

        const itemsResponse = await fetch(itemsUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${_token}`,
          },
        });

        const itemsData = await itemsResponse.json();

        if (!itemsResponse.ok) {
          console.error("ITEMS API ERROR:", itemsData);

          dispatch({
            type: "SET_DISCOVER_WEEKLY",
            discover_weekly: playlistDetails,
          });

          return;
        }

        // Combine playlist metadata and items
        const completePlaylist = {
          ...playlistDetails,
          items: itemsData,
        };

        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: completePlaylist,
        });
      } catch (error) {
        console.error("Spotify error:", error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, [dispatch]);

  if (loading) {
    return <div className="app"></div>;
  }

  return (
    <div className="app">
      {token ? (
        <Player spotify={spotify} token={token} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;