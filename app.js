const express = require("express");
const path = require("path");
const { fetchLatestJudgments } = require("./scraper");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const result = await fetchLatestJudgments();
  if (!result.success) {
    return res.render("index", { error: result.error });
  }

  db.prepare("INSERT INTO logs (raw_html) VALUES (?)").run(JSON.stringify(result.judgments));
  res.render("results", { judgments: result.judgments });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
