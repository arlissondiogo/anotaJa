import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Cadastro from './Components/Cadastro/Cadastro'
import Login from './Components/Login/Login' 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
