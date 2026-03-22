import { useState } from "react";
import { login, registerUser } from "../../services/api.js";
import "./Login.css";

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthValue, setStrengthValue] = useState(0);

  const [form, setForm] = useState({
    email: "",
    password: "",
    ownerName: "",
    businessName: "",
  });

  const update = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "password" && tab === "register") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    let strength = "fraca";
    let value = 0;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 8) value++;
    if (hasUpper) value++;
    if (hasLower) value++;
    if (hasNumber) value++;
    if (hasSpecial) value++;

    if (value >= 5) strength = "forte";
    else if (value >= 3) strength = "média";

    setPasswordStrength(strength);
    setStrengthValue((value / 5) * 100);
  };

  const isPasswordStrong = () => {
    return passwordStrength === "forte";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (tab === "login") {
        const data = await login(form.email, form.password);
        sessionStorage.setItem("token", data.token);
        onLogin?.();
      } else {
        if (!isPasswordStrong()) {
          setError("A senha é muito fraca. Use uma senha mais segura.");
          setLoading(false);
          return;
        }

        await registerUser(form);

        setSuccess("Conta criada! Faça login.");
        setTab("login");
        setPasswordStrength("");
        setStrengthValue(0);
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

  const getBarColor = () => {
    if (passwordStrength === "forte") return "#22c55e";
    if (passwordStrength === "média") return "#facc15";
    return "#ef4444";
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

        <p className="login-card__tagline">
          Sistema de gestão de restaurante
        </p>

        <div className="login-tabs">
          <button
            className={`login-tab ${
              tab === "login" ? "login-tab--active" : ""
            }`}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>

          <button
            className={`login-tab ${
              tab === "register" ? "login-tab--active" : ""
            }`}
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

          {tab === "register" && form.password && (
            <>
              <div className="password-bar">
                <div
                  className="password-bar-fill"
                  style={{
                    width: `${strengthValue}%`,
                    backgroundColor: getBarColor(),
                  }}
                />
              </div>

              <p
                className={`login-msg ${
                  passwordStrength === "forte"
                    ? "login-msg--success"
                    : passwordStrength === "média"
                    ? "login-msg--warning"
                    : "login-msg--error"
                }`}
              >
                Força da senha: {passwordStrength}
              </p>
            </>
          )}

          {error && <p className="login-msg login-msg--error">{error}</p>}

          {success && (
            <p className="login-msg login-msg--success">{success}</p>
          )}

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