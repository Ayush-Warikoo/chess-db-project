import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import { Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 2 },
    { field: 'white_player', headerName: 'White', fex: 2.5 },
    { field: 'white_elo', headerName: 'White Elo', flex: 1 },
    { field: 'black_player', headerName: 'Black', fex: 2.5 },
    { field: 'black_elo', headerName: 'Black Elo', flex: 1 },
    { field: 'result', headerName: 'Result', flex: 1.5 },
    { field: 'event', headerName: 'Event', fex: 2.5 },
    { field: 'site', headerName: 'Site', fex: 2.5 }
];

function DataTablePage() {
    const [rows, setRows] = useState([]);
    const [whitePlayer, setWhitePlayer] = useState('');
    const [blackPlayer, setBlackPlayer] = useState('');
    const [minElo, setMinElo] = useState('');
    const [event, setEvent] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://localhost:5000/api/table?whitePlayer=${whitePlayer}&blackPlayer=${blackPlayer}&minElo=${minElo}&event=${event}&result=${result}`);
            const data = await res.json();
            setRows(data);
        }
        fetchData();
    }, [whitePlayer, blackPlayer, minElo, event, result]);

    return (
        <Container maxWidth="lg">
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
                            max: 3000, min: 0
                        }
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
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                />
            </div>
        </Container>
    )
}

export default DataTablePage;