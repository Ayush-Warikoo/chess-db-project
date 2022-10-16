const { pool, query } = require("./db");

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

  const fens = [
    "rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 1",
    "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 1",
    "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 0 1",
  ];

  for (let i = 0; i < fens.length; i += 1) {
    await query("insert into positions values (?, ?, ?, ?, ?, ?)", [
      i + 1,
      1,
      fens[i],
      null,
      null,
      i + 1,
    ]);
  }

  pool.end();
  console.log("Done loading sample data!");
};

loadSampleData();
