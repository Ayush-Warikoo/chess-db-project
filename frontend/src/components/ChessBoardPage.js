import React, { useEffect, useRef, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button, List, ListItem, ListItemText } from '@mui/material';

import { isPawnPromotion, switchColor } from './helper';
import { WHITE } from './constants';

function ChessBoardPage() {
    const game = useRef();
    const [fen, setFen] = useState(null);
    const [orientation, setOrientation] = useState('white');
    const [gameOver, setGameOver] = useState(false);
    const [testData, setTestData] = useState([
        'Magnus Carlsen vs. Hikaru Nakamura',
        'Magnus Carlsen vs. Wesley So',
        'Magnus Carlsen vs. Fabiano Caruana',
        'Magnus Carlsen vs. Levon Aronian',
        'Magnus Carlsen vs. Ding Liren',
        'Magnus Carlsen vs. Anish Giri',
        'Magnus Carlsen vs. Maxime Vachier-Lagrave',
        'Magnus Carlsen vs. Ian Nepomniachtchi',
        'Magnus Carlsen vs. Alexander Grischuk',
        'Hans Niemann vs. Magnus Carlsen',
    ]);
    const [samePositionGames, setSamePositionGames] = useState([]);

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

    useEffect(() => {
        initializeState();
        getGameData();
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
    }

    function handleReset() {
        game.current.reset();
        setFen(game.current.fen());
        setGameOver(false);
    }

    return (
        <div style={{ background: '#eaeded', height: '100vh' }}>
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
                    <List
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 400,
                            '& ul': { padding: 1 },
                        }}
                    >
                        {testData.map((game, index) => (
                            <li key={`list-${index}`}>
                                <ul key={`item-${index}`}>
                                    <ListItem>
                                        <ListItemText primary={game} />
                                    </ListItem>
                                </ul>
                            </li>
                        ))}
                    </List>
                </div>
            </div>
        </div>
    )
}

export default ChessBoardPage;