import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Box,
  Stack,
  Dialog,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";

const PreviewGameModal = ({ theme, previewGame, onClose }) => {
  const [game, setGame] = useState(new Chess());
  const [selectedMoveNumber, setSelectedMoveNumber] = useState(-1);
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    const fetchPositions = async () => {
      const url = `http://localhost:5000/api/games/${previewGame?.id}/positions`;
      const response = await axios.get(url);
      setPositions(response.data);
    };
    if (previewGame !== null) {
      fetchPositions();
    }
  }, [previewGame]);

  useEffect(() => {
    const position = positions.find(
      (pos) => pos.move_number === selectedMoveNumber
    );
    if (position) {
      setGame(new Chess(position.fen));
    }
  }, [selectedMoveNumber, positions]);

  const goPrevMove = () =>
    setSelectedMoveNumber((prevSelectedMoveNumber) =>
      Math.max(0, prevSelectedMoveNumber - 1)
    );

  const goNextMove = () =>
    setSelectedMoveNumber((prevSelectedMoveNumber) =>
      Math.min(positions.length - 1, prevSelectedMoveNumber + 1)
    );

  const handleKeydown = (e) => {
    if (e.key === "ArrowLeft") {
      goPrevMove();
    } else if (e.key === "ArrowRight") {
      goNextMove();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  const movePairs = [];
  const positionsSkipFirst = positions.slice(1, positions.length);
  for (let i = 0; i < positionsSkipFirst.length; i += 2) {
    movePairs.push(positionsSkipFirst.slice(i, i + 2));
  }

  const moveTableCell = (position) => {
    const highlightedColor =
      theme === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)";
    const cellHoverStyle = {
      "&:hover": {
        backgroundColor: highlightedColor,
        cursor: "pointer",
      },
    };
    if (position.move_number === selectedMoveNumber) {
      cellHoverStyle.backgroundColor = highlightedColor;
    }
    return (
      <TableCell
        sx={cellHoverStyle}
        onClick={() => {
          setSelectedMoveNumber(position.move_number);
        }}
      >
        {position.prev_move}
      </TableCell>
    );
  };
  console.log(previewGame);
  return (
    <Dialog
      onClose={onClose}
      open={previewGame !== null}
      fullWidth
      maxWidth="md"
      sx={{
        minHeight: 800,
      }}
    >
      <Box padding={2} display="flex" justifyContent="center">
        <Stack direction="column" spacing={2}>
          <Box>
            {previewGame && (
              <Typography variant="h5">
                {previewGame.event}
                <Typography variant="subtitle1">
                  {moment(previewGame.date).format("dddd, MMMM Do YYYY")}
                </Typography>
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2}>
            <Box>
              {previewGame && (
                <Typography
                  mb={1}
                  variant="h6"
                  display="flex"
                  alignItems="center"
                >
                  <CircleIcon sx={{ color: "black" }} />
                  {`${previewGame.black_player} (${previewGame.black_elo}) - ${
                    previewGame.result === "white"
                      ? "0"
                      : previewGame.result === "black"
                      ? "1"
                      : "1/2"
                  }`}
                </Typography>
              )}
              <Chessboard
                id="BasicBoard"
                position={game.fen()}
                arePiecesDraggable={false}
                boardWidth={450}
              />
              {previewGame && (
                <Typography
                  mt={1}
                  variant="h6"
                  display="flex"
                  alignItems="center"
                >
                  <CircleIcon sx={{ color: "white" }} />
                  {`${previewGame.white_player} (${previewGame.white_elo}) - ${
                    previewGame.result === "white"
                      ? "1"
                      : previewGame.result === "black"
                      ? "0"
                      : "1/2"
                  }`}
                </Typography>
              )}
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <TableContainer sx={{ maxHeight: 450, minWidth: 200 }}>
                <Table>
                  <TableBody>
                    {movePairs.map((pair, idx) => {
                      return (
                        <TableRow key={pair[0].fen}>
                          <TableCell>{idx + 1}</TableCell>
                          {moveTableCell(pair[0])}
                          {pair[1] && moveTableCell(pair[1])}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box>
                <IconButton
                  onClick={() => setSelectedMoveNumber(0)}
                  disabled={selectedMoveNumber === 0}
                >
                  <FirstPageIcon />
                </IconButton>
                <IconButton
                  onClick={goPrevMove}
                  disabled={selectedMoveNumber === 0}
                >
                  <PrevPageIcon />
                </IconButton>
                <IconButton
                  onClick={goNextMove}
                  disabled={selectedMoveNumber === positions.length - 1}
                >
                  <NextPageIcon />
                </IconButton>
                <IconButton
                  onClick={() => setSelectedMoveNumber(positions.length - 1)}
                  disabled={selectedMoveNumber === positions.length - 1}
                >
                  <LastPageIcon />
                </IconButton>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default PreviewGameModal;
