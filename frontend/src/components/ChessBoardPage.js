import React, { useEffect, useRef, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';

import { isPawnPromotion, switchColor, calculateWinrate } from './helper';
import { WHITE } from './constants';
import TEST_DATA from '../testData';

function ChessBoardPage({ theme }) {
    const game = useRef();
    const [fen, setFen] = useState(null);
    const [orientation, setOrientation] = useState('white');
    const [gameOver, setGameOver] = useState(false);
    const [samePositionGames, setSamePositionGames] = useState([]);
    const [winrate, setWinrate] = useState(0);

    function initializeState() {
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        game.current = new Chess();
        setFen(game.current.fen());
    }

    async function getGameData() {
        const result = await fetch(`http://localhost:5000/api/games/${encodeURIComponent(game.current.fen())}`);
        const data = await result.json();
        setSamePositionGames(data);
    }

    async function getWinrateData() {
        const result = await fetch(`http://localhost:5000/api/games/${encodeURIComponent(game.current.fen())}/winrate`);
        const data = await result.json();
        setWinrate(data);
    }

    useEffect(() => {
        initializeState();
        getGameData();
        getWinrateData();
    }, []);

    function handleMove(move) {
        const piece = game.current.get(move.from);
        if (isPawnPromotion(move, piece)) {
            console.log('promotion');
            move.promotion = 'q';
        }
        // console.log(game.current._turn, piece.color)
        const isValidMove = game.current.move(move);
        if (isValidMove) {
            setFen(game.current.fen());
            getGameData();
            getWinrateData();
            checkGameStatus();
        }
    }

    function checkGameStatus() {
        if (game.current.isDraw()) {
            setGameOver(true);
            alert('Game over, drawn position');
        } else if (game.current.isGameOver()) {
            setGameOver(true);
            const winner = game.current.turn() === WHITE ? 'black' : 'white';
            alert('Game over, ' + winner + ' wins!');
        }
    }

    function onDrop(sourceSquare, targetSquare) {
        if (gameOver) return;
        const proposedMove = { from: sourceSquare, to: targetSquare };
        handleMove(proposedMove, true);
    }

    function handleUndo() {
        game.current.undo();
        setFen(game.current.fen());
        getGameData();
        getWinrateData();
    }

    function handleReset() {
        game.current.reset();
        setFen(game.current.fen());
        getGameData();
        getWinrateData();
        setGameOver(false);
    }

    return (
        <div style={{ height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <Chessboard
                        id="humanVsHuman"
                        position={fen}
                        onPieceDrop={onDrop}
                        boardOrientation={orientation}
                        width={500}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '10px 20px', padding: '15px' }}
                        onClick={() => setOrientation(prevCol => switchColor(prevCol))}
                    >
                        Flip
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUndo}
                        style={{ margin: '10px 20px', padding: '15px' }}
                    >
                        Undo
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReset}
                        style={{ margin: '10px 20px', padding: '15px' }}
                    >
                        Reset
                    </Button>
                </div>
                <div>
                    <Typography variant="h6" component="h2">
                        Winrate % (W/B/D): {calculateWinrate(winrate).join(' / ')}
                    </Typography>
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            height: 400,
                            border: '1px solid #d3d4d5',
                            '& ul': { padding: 0 },
                            padding: '0px',
                        }}
                    >
                        <li>
                            {/* {console.log(samePositionGames)}
                            {console.log(TEST_DATA)} */}
                            {[...samePositionGames, ...TEST_DATA].map(({games, white, black}, index) => (
                                <ul key={`item-${index}`}>
                                    <ListItem
                                        sx={{
                                            '&:hover': { backgroundColor: theme === 'dark' ? '#333' : '#e2e2e2' },
                                            border: '1px solid #e2e2e2',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        <ListItemText primary={`${white.name} (${games.white_elo}) vs
                                        ${black.name} (${games.black_elo})
                                        - ${new Date(games.date).toDateString()}`} />
                                    </ListItem>
                                </ul>))}
                        </li>
                    </List>
                </div>
            </div>
        </div>
    );
}

export default ChessBoardPage;