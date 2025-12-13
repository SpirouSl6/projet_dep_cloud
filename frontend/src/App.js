import { useState } from "react";

function App() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const API_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Envoi en cours...");

    try {
      const res = await fetch(`${API_URL}/inscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, email }),
      });

      const data = await res.json();
      setMessage(`✔ Inscription réussie (ID = ${data.id})`);

      setNom("");
      setEmail("");
    } catch (error) {
      setMessage("❌ Erreur lors de l'inscription.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}>
      
      {/* 🔹 TITRE PRINCIPAL */}
      <h1>Plateforme EduTech - Inscription des étudiants</h1>
      <p style={{ color: "#555", marginBottom: "3rem" }}>
        Frontend React déployé sur Kubernetes
      </p>

      {/* 🔹 FORMULAIRE */}
      <h2>Inscription Étudiant</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "1rem",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "1rem",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            width: "100%",
            cursor: "pointer",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            fontSize: "1rem",
          }}
        >
          S'inscrire
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default App;
