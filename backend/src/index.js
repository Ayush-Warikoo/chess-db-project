const express = require("express");
const { query } = require("./db");
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true
};

const app = express();
app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  const results = await query("select * from players");
  res.send(results);
});

app.get("/test", (req, res) => {
    res.status(200).send("OK");
});

// api gets all games with a given fen
app.get("/api/games/:fen", async (req, res) => {
    const fen = req.params.fen;
    console.log(fen);
    const results = await query("SELECT * FROM positions WHERE fen = ?", [fen]);
    console.log(results);
    res.send(results);
});

app.listen(process.env.PORT || 5000);
