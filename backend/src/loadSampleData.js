const { pool, query } = require("./db.js");

const loadSampleData = async () => {
  await query("insert into players (name) values (?), (?), (?), (?)", [
    "ayush",
    "dhruv",
    "kevin",
    "matt",
  ]);
  await query(
    "insert into games values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      1,
      "chess duel",
      "basement",
      "2022-10-31",
      180,
      2,
      1,
      2,
      2434,
      2500,
      "draw",
      null,
      null,
      4,
    ]
  );

  // a game of culture
  const fens = [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq e6 0 2",
    "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2",
    "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
  ];

  for (let i = 0; i < fens.length; i++) {
    await query("insert into positions values (?, ?, ?, ?)", [
      1,
      1,
      fens[i],
      i + 1
    ]);
  }

  pool.end();
  console.log("Done loading sample data!");
};

loadSampleData();
