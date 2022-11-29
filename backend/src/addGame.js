const { Chess } = require("chess.js");
const { parse } = require("@mliebelt/pgn-parser");
const { query } = require("./db.js");

const addGame = async (req) => {
  var pgnList = [];
  var tagsList = [];

  for (var i = 0; i < req.length; i++) {
    const pgn = parse(req[i])[0];
    const tags = pgn.tags;
    pgnList.push(pgn);
    tagsList.push(tags);
  }

  var blackTags = [];
  var whiteTags = [];

  for (var i = 0; i < req.length; i++) {
    blackTags[i] = tagsList[i].Black;
    whiteTags[i] = tagsList[i].White;
  }

  await query(
    "insert into players (name) values (?) ON DUPLICATE KEY UPDATE id=id;",
    blackTags
  );

  await query(
    "insert into players (name) values (?) ON DUPLICATE KEY UPDATE id=id;",
    whiteTags
  );

  for (var i = 0; i < req.length; i++) {
    var whiteId = -1;
    var blackId = -1;
    const pgn = pgnList[i];
    const tags = pgn.tags;

    await query("select id from players where name=(?)", blackTags[i]).then(
      function (results) {
        blackId = results[0].id;
      }
    );
    await query("select id from players where name=(?)", whiteTags[i]).then(
      function (results) {
        whiteId = results[0].id;
      }
    );

    await query(
      `insert into games (event, site, date, main_time, increment_time, 
            white_id, black_id, white_elo, black_elo, result, 
            eco_category, eco_subcategory, plycount) 
            values (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        tags.Event,
        tags.Site,
        tags.Date.value.replace(/\./g, "-"),
        tags.TimeControl[0].seconds,
        tags.TimeControl[0].increment,
        whiteId,
        blackId,
        tags.WhiteElo,
        tags.BlackElo,
        tags.Result == "1-0"
          ? "white"
          : tags.Result == "0-1"
          ? "black"
          : "draw",
        tags.ECO.substring(0, 1),
        tags.ECO.substring(1),
        tags.PlyCount,
      ]
    ).then(function (results) {
      gameId = results.insertId;
    });

    var chessPGN = new Chess();
    var chess = new Chess();

    chessPGN.loadPgn(req[i]);
    var moves = chessPGN.history();

    for (let moveCount = 0; moveCount <= moves.length; moveCount++) {
      var fen = chess.fen();
      await query(
        "insert into positions (game_id, fen, move_number, next_move, prev_move) values (?,?,?,?,?)",
        [
          gameId,
          fen,
          moveCount,
          moveCount == moves.length ? null : moves[moveCount],
          moveCount == 0 ? null : moves[moveCount - 1],
        ]
      );
      chess.move(moves[moveCount]);
    }
  }
};

module.exports = {
  addGame,
};
