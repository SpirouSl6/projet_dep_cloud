const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API EduTech Fonctionnelle" });
});

app.post("/inscription", (req, res) => {
  const { nom, email } = req.body;
  res.json({ status: "Inscription enregistrée", nom, email });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
