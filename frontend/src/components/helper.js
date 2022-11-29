import { PIECE, WHITE, BLACK } from './constants';

function isPawnPromotion(move, piece) {
    return piece.type === PIECE.pawn
    && ((move.to[1] === '8' && piece.color === WHITE)
    || (move.to[1] === '1' && piece.color === BLACK));
}

function switchColor(color) {
    return (color === 'white' || color === WHITE) ? 'black' : 'white';
}

function calculateWinrate(winrate) {
    const total = winrate.white + winrate.black + winrate.draw;
    if (total === 0) return ['-', '-', '-'];
    const whiteWinrate = Math.round(winrate.white / total * 100);
    const blackWinrate = Math.round(winrate.black / total * 100);
    const drawrate = Math.round(winrate.draw / total * 100);
    return [whiteWinrate, blackWinrate, drawrate];
}

function calculateEvalBarPixels(engineEval) {
    const max = 480;
    const min = 0;
    const pixels = 250 + engineEval*(-25/100);
    return Math.min(Math.max(pixels, min), max);
}

export { isPawnPromotion, switchColor, calculateWinrate, calculateEvalBarPixels };