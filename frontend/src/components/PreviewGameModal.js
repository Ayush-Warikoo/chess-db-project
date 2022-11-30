import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";

const PreviewGameModal = ({ previewGame, onClose }) => {
  const [game, setGame] = useState(new Chess());
  const [selectedMoveNumber, setSelectedMoveNumber] = useState(null);
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

  const movePairs = [];
  for (let i = 0; i < positions.length; i += 2) {
    movePairs.push(positions.slice(i, i + 2));
  }
  console.log(movePairs);
  return (
    <Dialog
      onClose={onClose}
      open={previewGame !== null}
      fullWidth
      maxWidth="md"
    >
      <Box padding={2} display="flex" justifyContent="center">
        <Stack direction="row" spacing={2}>
          <Chessboard
            id="BasicBoard"
            position={game.fen()}
            arePiecesDraggable={false}
            boardWidth={450}
          />
          <Box>
            <TableContainer sx={{ maxHeight: 450, minWidth: 200 }}>
              <Table>
                <TableBody>
                  {movePairs.map((pair, idx) => {
                    return (
                      <TableRow key={pair[0].fen}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell
                          hover
                          // sx={{
                          //   "&:hover": {
                          //     background: "yellow",
                          //   },
                          // }}
                        >
                          {pair[0].next_move}
                        </TableCell>
                        {pair[1] && <TableCell>{pair[1].next_move}</TableCell>}
                      </TableRow>
                    );
                  })}
                  {/* <TableRow>
                  <TableCell>1.</TableCell>
                  <TableCell>e4</TableCell>
                  <TableCell>e5</TableCell>
                </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default PreviewGameModal;
