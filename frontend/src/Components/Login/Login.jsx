import { useState } from "react";
import { login, registerUser } from "../../services/api.js";
import "../Login/Login.css";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    ownerName: "",
    businessName: "",
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (tab === "login") {
        const data = await login(form.email, form.password);

        localStorage.setItem("token", data.token);

        onLogin?.();
      } else {
        await registerUser(form);

        setSuccess("Conta criada! Faça login.");
        setTab("login");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <span>🍽️</span>
          <span>
            Anota<span className="logo-accent">Já</span>
          </span>
        </div>

        <p className="login-card__tagline">Sistema de gestão de restaurante</p>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === "login" ? "login-tab--active" : ""}`}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>

          <button
            className={`login-tab ${tab === "register" ? "login-tab--active" : ""}`}
            onClick={() => setTab("register")}
          >
            Cadastrar
          </button>
        </div>

        <div className="login-form">
          {tab === "register" && (
            <>
              <input
                className="login-input"
                placeholder="Seu nome"
                value={form.ownerName}
                onChange={update("ownerName")}
              />

              <input
                className="login-input"
                placeholder="Nome do negócio"
                value={form.businessName}
                onChange={update("businessName")}
              />
            </>
          )}

          <input
            className="login-input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
          />

          <input
            className="login-input"
            placeholder="Senha"
            type="password"
            value={form.password}
            onChange={update("password")}
            onKeyDown={handleKey}
          />

          {error && <p className="login-msg login-msg--error">{error}</p>}

          {success && <p className="login-msg login-msg--success">{success}</p>}

          <button
            className="login-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Aguarde..."
              : tab === "login"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
