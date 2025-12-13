const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connexion MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DB || "edutech",
});

// 🔹 API OK
app.get("/", (req, res) => {
  res.json({ message: "API EduTech Fonctionnelle" });
});

// 🔹 TEST BDD
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ db: "OK", result: rows[0].result });
  } catch (err) {
    res.status(500).json({ db: "ERROR", error: err.message });
  }
});

// 🔹 POST inscription (création)
app.post("/inscription", async (req, res) => {
  const { nom, email } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO inscriptions (nom, email) VALUES (?, ?)",
      [nom, email]
    );

    res.json({
      id: result.insertId,
      nom,
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NOUVELLE ROUTE : GET inscription (lecture)
app.get("/inscription", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nom, email FROM inscriptions ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("Backend running on port 3000")
);
