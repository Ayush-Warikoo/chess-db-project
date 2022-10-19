import { PIECE, WHITE, BLACK } from './constants';

function isPawnPromotion(move, piece) {
    return piece.type === PIECE.pawn
    && ((move.to[1] === '8' && piece.color === WHITE)
    || (move.to[1] === '1' && piece.color === BLACK));
}

function switchColor(color) {
    return (color === 'white' || color === WHITE) ? 'black' : 'white';
}

export { isPawnPromotion, switchColor };