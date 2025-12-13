const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

// Autoriser toutes les origines (en dev)
app.use(cors());

app.use(express.json());

// Connexion MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "password",
  database: process.env.MYSQL_DB || "edutech",
});

// Route de test API
app.get("/", (req, res) => {
  res.json({ message: "API EduTech Fonctionnelle" });
});

// Route de test BDD
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ db: "OK", result: rows[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "ERROR", message: err.message });
  }
});

// Route inscription
app.post("/inscription", async (req, res) => {
  const { nom, email } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO inscriptions (nom, email) VALUES (?, ?)",
      [nom, email]
    );

    res.json({
      status: "Inscription enregistrée",
      id: result.insertId,
      nom,
      email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur BDD", error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
