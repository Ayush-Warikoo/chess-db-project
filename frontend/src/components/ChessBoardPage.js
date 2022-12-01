import React, { useEffect, useRef, useState } from 'react';
import * as ChessJS from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { isPawnPromotion, switchColor, calculateWinrate, calculateEvalBarPixels } from './helper';
import { WHITE } from './constants';

function ChessBoardPage({ theme }) {
    const game = useRef();
    const [fen, setFen] = useState(null);
    const [orientation, setOrientation] = useState('white');
    const [gameOver, setGameOver] = useState(false);
    const [samePositionGames, setSamePositionGames] = useState([]);
    const [winrate, setWinrate] = useState(0);
    const [engineEval, setEngineEval] = useState(31);
    const [engineMoves, setEngineMoves] = useState(["c2c4 c7c5", "g2g3 b8c6", "g1f3 g7g6", "f1g2 f8g7", "b1c3 g8f6", "d2d4 c6d4"]);

    function initializeState() {
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        game.current = new Chess();
        setFen(game.current.fen());
    }

    async function getGameData() {
        const result = await fetch(`http://localhost:5000/api/games/${encodeURIComponent(game.current.fen())}`);
        const data = await result.json();
        console.log(data);
        setSamePositionGames(data);
    }

    async function getWinrateData() {
        const result = await fetch(`http://localhost:5000/api/games/${encodeURIComponent(game.current.fen())}/winrate`);
        const data = await result.json();
        setWinrate(data);
    }

    async function getEngineEval() {
        const result = await fetch(`http://localhost:5000/engineAnalysis/${encodeURIComponent(game.current.fen())}`);
        const data = await result.json();
        const halfMoves = data.pv?.split(" ");
        const moves = [data.pv];
        setEngineEval(data.score.value);
        setEngineMoves(moves);
    }

    useEffect(() => {
        initializeState();
        getGameData();
        getWinrateData();
    }, []);

    function handleMove(move) {
        const piece = move.from && game.current.get(move.from);
        if (piece && isPawnPromotion(move, piece)) {
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
            getEngineEval();
        }
    }

    function checkGameStatus() {
        if (game.current.isDraw()) {
            setGameOver(true);
            toast.info('Game is drawn', {
              position: 'top-right',
              autoClose: 2000,
              closeOnClick: true,
              pauseOnHover: true,
              progress: undefined,
              theme,
              icon: false
            });
        } else if (game.current.isGameOver()) {
            setGameOver(true);
            const winner = game.current.turn() === WHITE ? 'black' : 'white';
            toast.info(`Game over, ${winner} wins`, {
              position: 'top-right',
              autoClose: 2000,
              closeOnClick: true,
              pauseOnHover: true,
              progress: undefined,
              theme,
              icon: false
          });
        }
    }

    function onDrop(sourceSquare, targetSquare) {
        if (gameOver) return;
        const proposedMove = { from: sourceSquare, to: targetSquare };
        handleMove(proposedMove);
    }

    function handleUndo() {
        game.current.undo();
        setFen(game.current.fen());
        getGameData();
        getWinrateData();
        checkGameStatus();
        getEngineEval();
    }

    function handleReset() {
        game.current.reset();
        setFen(game.current.fen());
        getGameData();
        getWinrateData();
        checkGameStatus();
        getEngineEval();
        setGameOver(false);
    }

    return (
        <div style={{ height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    {/* Engine evaluation bar*/}
                    <Typography variant="h6">
                        {engineEval/100}
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '40px', height: '500px', backgroundColor: engineEval > -1000 ? 'white' : 'black', borderRadius: '20px', border: `2px solid ${theme === 'light' ? 'black' : 'white'}`, marginRight: '20px' }}>
                            <div style={{ width: `36px`, height: `${calculateEvalBarPixels(engineEval)}px`, backgroundColor: 'black', borderRadius: '20px 20px 0px 0px' }}>
                            </div>
                        </div>
                    </div>

                </div>
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
                    <div style={{marginBottom: '10px'}}>
                            <Typography variant="h6" component="h2"> Stockfish 15 Engine: </Typography>
                            <Card style={{width: '400px'}}>
                                <CardContent>
                                    <Typography variant="body1" color="text.secondary">
                                    {engineMoves.reduce((acc, move, ind) => {
                                        const moveNum = Math.floor(game.current?.history()?.length/2) + ind + 1;
                                        return acc + `${moveNum}. ` + move + ' ';
                                    }, '')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
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
                          {samePositionGames.length > 0
                            ? [...samePositionGames].map(({ games, white, black, positions }, index) => (
                                <ul key={`item-${index}`}>
                                    <ListItem
                                        sx={{
                                            '&:hover': { backgroundColor: theme === 'dark' ? '#333' : '#e2e2e2' },
                                            border: '1px solid #e2e2e2',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        onClick={() => positions.next_move && handleMove(positions.next_move)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem',
                                                        textAlign: 'left',
                                                        width: '100px',
                                                    }}
                                                >
                                                    {positions.next_move || 'N/A'}
                                                </Typography>
                                            }
                                        />
                                        <ListItemText primary={`${white.name} (${games.white_elo}) vs
                                        ${black.name} (${games.black_elo})
                                        - ${new Date(games.date).toDateString()}`} />
                                        
                                    </ListItem>
                                </ul>))
                                : <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', marginTop: '100px'}}>
                                    No games found with this position
                                  </Typography>}
                        </li>
                    </List>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ChessBoardPage;