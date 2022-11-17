import axios from "axios";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import moment from "moment";

const DEFAULT_PROFILE_PIC_URL = `https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg`;

const ProfilePage = () => {
  const { name } = useParams();
  const [player, setPlayer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [modifiedPlayer, setModifiedPlayer] = useState(null);

  const fetchPlayer = async () => {
    const response = await axios.get(`http://localhost:5000/players/${name}`);

    setPlayer(response.data);
    setModifiedPlayer({ ...response.data });
  };

  const updatePlayer = async () => {
    await axios.put(`http://localhost:5000/players/${name}`, {
      ...modifiedPlayer,
      birth_date: modifiedPlayer.birth_date
        ? moment(modifiedPlayer.birth_date).format("YYYY-MM-DD")
        : null,
    });
    await fetchPlayer();
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  if (!player) {
    return null;
  }
  return (
    <Stack direction="row" spacing={1} width="900px" margin="50px auto">
      <Stack
        direction="column"
        alignItems="center"
        spacing={2}
        border="1px solid black"
        padding="20px"
      >
        <div
          style={{
            width: "300px",
            height: "300px",
            backgroundImage: `url("${
              player?.profile_pic_url || DEFAULT_PROFILE_PIC_URL
            }")`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Grid container spacing={1}>
          {editing && (
            <Grid item xs={12} textAlign="center">
              <TextField
                label="Profile Picture URL"
                value={modifiedPlayer.profile_pic_url}
                onChange={(e) =>
                  setModifiedPlayer((prevModifiedPlayer) => ({
                    ...prevModifiedPlayer,
                    profile_pic_url: e.target.value,
                  }))
                }
              />
            </Grid>
          )}
          <Grid item xs={3} textAlign="right">
            <Typography fontWeight="bold">Name:</Typography>
          </Grid>
          <Grid item xs={9} textAlign="left">
            <Typography>{player.name}</Typography>
          </Grid>

          {player.birth_date && (
            <>
              <Grid item xs={3} textAlign="right">
                <Typography fontWeight="bold">Born:</Typography>
              </Grid>
              <Grid item xs={9} textAlign="left">
                <Typography>
                  {moment(player.birth_date).format("YYYY-MM-DD")}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        {!editing && (
          <Button variant="outlined" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
        {editing && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setEditing(false);
                updatePlayer();
              }}
              disabled={_.isEqual(player, modifiedPlayer)}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditing(false);
                setModifiedPlayer({ ...player });
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </Stack>
      <Box border="1px solid black" padding="20px" width="500px">
        <Typography variant="h6" fontWeight="bold">
          Bio:
        </Typography>
        {editing ? (
          <TextareaAutosize
            defaultValue={modifiedPlayer.bio}
            style={{
              maxWidth: "100%",
              width: "100%",
              maxHeight: "90%",
              height: "90%",
            }}
            onChange={(e) =>
              setModifiedPlayer((prevModifiedPlayer) => ({
                ...prevModifiedPlayer,
                bio: e.target.value,
              }))
            }
          />
        ) : (
          player.bio || "This player does not have a bio yet."
        )}
      </Box>
    </Stack>
  );
};

export default ProfilePage;
