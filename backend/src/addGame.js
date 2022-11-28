const { Chess } = require("chess.js");
const { parse } = require("@mliebelt/pgn-parser");
const { query } = require("./db.js");

const addSampleGame = async (req) => {
  const pgn = parse(req)[0];
  const tags = pgn.tags;

  var whiteId = -1;
  var blackId = -1;
  var gameId = -1;Í

  await query(
    "insert into players (name) values (?) ON DUPLICATE KEY UPDATE id=id;",
    [tags.Black]
  );
  await query(
    "insert into players (name) values (?) ON DUPLICATE KEY UPDATE id=id;",
    [tags.White]
  );
  await query("select id from players where name=(?)", [tags.Black]).then(
    function (results) {
      blackId = results[0].id;
    }
  );
  await query("select id from players where name=(?)", [tags.White]).then(
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
      tags.Result == "1-0" ? "white" : tags.Result == "0-1" ? "black" : "draw",
      tags.ECO.substring(0, 1),
      tags.ECO.substring(1),
      tags.PlyCount,
    ]
  ).then(function (results) {
    gameId = results.insertId;
  });
  var chessPGN = new Chess();
  var chess = new Chess();
  chessPGN.loadPgn(req);
  var moves = chessPGN.history();
  var moveCount = 1;
  for (var move in moves) {
    chess.move(moves[move]);
    var fen = chess.fen();
    await query(
      "insert into positions (game_id, fen, move_number) values (?,?,?)",
      [gameId, fen, moveCount]
    );
    moveCount++;
  }
};

const addGame = async (req) => {
  var pgnList = [];
  var tagsList = [];

  for (var i = 0; i < req.length; i++) {
    console.log(req[i]);
    const pgn = parse(req[i])[0];
    console.log(pgn);
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
    var moveCount = 1;

    for (var move in moves) {
      chess.move(moves[move]);
      var fen = chess.fen();
      await query(
        "insert into positions (game_id, fen, move_number) values (?,?,?)",
        [gameId, fen, moveCount]
      );
      moveCount++;
    }
  }
};

module.exports = {
  addGame,
  addSampleGame,
};
