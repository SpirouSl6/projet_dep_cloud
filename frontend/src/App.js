import { useEffect, useState } from "react";

function App() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [inscriptions, setInscriptions] = useState([]);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  // 🔹 Charger les inscriptions
  const loadInscriptions = async () => {
    const res = await fetch(`${API_URL}/inscription`);
    const data = await res.json();
    setInscriptions(data);
  };

  useEffect(() => {
    loadInscriptions();
  }, []);

  // 🔹 Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Envoi en cours...");

    try {
      const res = await fetch(`${API_URL}/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email }),
      });

      await res.json();
      setMessage("✔ Inscription réussie");

      setNom("");
      setEmail("");
      loadInscriptions(); // 🔥 refresh liste
    } catch {
      setMessage("❌ Erreur lors de l'inscription");
    }
  };

  return (
    <div style={{ maxWidth: "650px", margin: "4rem auto", textAlign: "center" }}>
      
      <h1>Plateforme EduTech - Inscription des étudiants</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>
        Frontend React déployé sur Kubernetes
      </p>

      {/* FORMULAIRE */}
      <h2>Nouvelle inscription</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />

        <button style={{ width: "100%", padding: "10px" }}>
          S'inscrire
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* LISTE DES INSCRIPTIONS */}
      <h2 style={{ marginTop: "3rem" }}>Inscriptions</h2>

      <ul style={{ textAlign: "left" }}>
        {inscriptions.map((i) => (
          <li key={i.id}>
            <strong>{i.nom}</strong> – {i.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
