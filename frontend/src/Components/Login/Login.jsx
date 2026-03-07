import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import logo from "../../assets/logo.png"

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const loginData = {
      email,
      password
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()

      console.log("Login realizado:", data)

      setMessage("Login realizado com sucesso!")

      // redireciona para home e remove login do histórico
      navigate("/home", { replace: true })

    } catch (error) {
      console.error("Erro:", error)
      setMessage("Email ou senha incorretos.")
    }
  }

  return (
    <div className="page">
      <img className="logo" src={logo} alt="Logo" />

      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>

          <div className="input-field">
            <input
              type="email"
              required
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icons" />
          </div>

          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {showPassword ? (
              <FaEyeSlash
                className="icons"
                onClick={() => setShowPassword(false)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FaEye
                className="icons"
                onClick={() => setShowPassword(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          <button type="submit">Entrar</button>

          <Link to="/cadastro">
            <button type="button" className="register-button">
              Criar conta
            </button>
          </Link>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login