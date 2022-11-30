import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button } from "@mui/material";

import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import PreviewGameModal from "./PreviewGameModal";

function DataTablePage({ theme }) {
  const [rows, setRows] = useState([]);
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [minElo, setMinElo] = useState("");
  const [event, setEvent] = useState("");
  const [ecoCode, setEcoCode] = useState("");
  const [result, setResult] = useState("");
  const [previewGame, setPreviewGame] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "date", headerName: "Date", flex: 2 },
    {
      field: "white_player",
      headerName: "White",
      fex: 2.5,
      renderCell: ({ value }) => (
        <MuiLink
          as={Link}
          to={`/profile/${value}`}
          sx={{ color: theme === "light" ? "#1976d2" : "#90caf9" }}
        >
          {value}
        </MuiLink>
      ),
    },
    { field: "white_elo", headerName: "White Elo", flex: 1 },
    {
      field: "black_player",
      headerName: "Black",
      fex: 2.5,
      renderCell: ({ value }) => (
        <MuiLink
          as={Link}
          to={`/profile/${value}`}
          sx={{ color: theme === "light" ? "#1976d2" : "#90caf9" }}
        >
          {value}
        </MuiLink>
      ),
    },
    { field: "black_elo", headerName: "Black Elo", flex: 1 },
    { field: "result", headerName: "Result", flex: 1.5 },
    { field: "event", headerName: "Event", flex: 2.5 },
    { field: "site", headerName: "Site", flex: 2.5 },
    { field: "eco_code", headerName: "ECO code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 4,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => setPreviewGame(params.row)}
            >
              Preview
            </Button>
            <Button
              onClick={async (e) => {
                e.stopPropagation();
                async function deleteRow(id) {
                  const url = `http://localhost:5000/api/games/removeGame`;
                  await axios.post(url, { id: id }).then((res) => {
                    console.log(res);
                  });
                }
                await deleteRow(params.row.id);
                e.stopPropagation(); // don't select this row after clicking

                // Update UI directly
                const newRows = rows.filter((row) => row.id !== params.row.id);
                setRows(newRows);

                toast.success(`Game ${params.row.id} deleted successfully`, {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  theme,
                });
              }}
              variant="contained"
            >
              Delete
            </Button>
          </Stack>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `http://localhost:5000/api/table?whitePlayer=${whitePlayer}&blackPlayer=${blackPlayer}&minElo=${minElo}&event=${event}&ecoCode=${ecoCode}&result=${result}`
      );
      const data = await res.json();
      setRows(data);
    }
    fetchData();
  }, [whitePlayer, blackPlayer, minElo, event, ecoCode, result]);

  return (
    <Container maxWidth="lg">
      <PreviewGameModal
        theme={theme}
        previewGame={previewGame}
        onClose={() => setPreviewGame(null)}
      />
      {/* create toolbar to filter data */}
      <div>
        <br />
        <TextField
          label="White player"
          value={whitePlayer}
          onChange={(e) => setWhitePlayer(e.target.value)}
        />
        <TextField
          label="Black player"
          value={blackPlayer}
          onChange={(e) => setBlackPlayer(e.target.value)}
        />
        <TextField
          type="number"
          InputProps={{
            inputProps: {
              max: 3000,
              min: 0,
            },
          }}
          label="Min Elo"
          value={minElo}
          onChange={(e) => setMinElo(e.target.value)}
        />
        <TextField
          label="Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        />
        <TextField
          label="ECO code"
          value={ecoCode}
          onChange={(e) => setEcoCode(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="result-select-label"> Result </InputLabel>
          <Select
            id="result-select-label"
            value={result}
            label="Result"
            onChange={(e) => setResult(e.target.value)}
          >
            <MenuItem value={"white"}> White </MenuItem>
            <MenuItem value={"black"}> Black </MenuItem>
            <MenuItem value={"draw"}> Draw </MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* {console.log(rows)} */}
      <div style={{ height: 631, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </div>
      <ToastContainer />
    </Container>
  );
}

export default DataTablePage;
