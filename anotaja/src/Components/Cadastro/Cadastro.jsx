import { FaUser, FaLock, FaIdCard, FaShopify } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";
import logo from "../../assets/logo.png";

const Cadastro = () => {
  const [ownerName, setOwnerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      ownerName,
      businessName,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar");
      }

      const data = await response.json();

      setMessage("Cadastro realizado com sucesso!");

      setOwnerName("");
      setBusinessName("");
      setEmail("");
      setPassword("");

      console.log("Resposta do servidor:", data);
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="page">
      <img className="logo" src={logo} alt="Logo" />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Cadastre-se aqui</h1>

          <div className="input-field">
            <input
              required
              type="text"
              placeholder="Nome do proprietário"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <FaIdCard className="icons" />
          </div>

          <div className="input-field">
            <input
              required
              type="text"
              placeholder="Nome do estabelecimento"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <FaShopify className="icons" />
          </div>

          <div className="input-field">
            <input
              required
              type="email"
              placeholder="Informe seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icons" />
          </div>

          <div className="input-field">
            <input
              required
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icons" />
          </div>

          <button type="submit">Registrar</button>

          <Link to="/">
            <button type="button" className="back-button">
              Voltar para Login
            </button>
          </Link>

          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Cadastro;