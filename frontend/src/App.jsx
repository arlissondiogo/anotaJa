import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"

import Cadastro from './Components/Cadastro/Cadastro'
import Login from './Components/Login/Login'

function AppRoutes() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/dashboard")
  }

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App