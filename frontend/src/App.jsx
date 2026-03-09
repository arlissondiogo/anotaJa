import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import LoginPage from "./pages/Login/Login";
import HomePage from "./pages/Home/HomePage";
import ProductsPage from "./pages/Products/ProductsPage";
import OrdersPage from "./pages/Orders/OrdersPage";

function AppInner({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("AVAILABLE");
  const location = useLocation();
  const isHome = location.pathname === "/mesas";

  return (
    <div className="app">
      <Header
        onMenuClick={() => setSidebarOpen((v) => !v)}
        activeTab={isHome ? activeTab : undefined}
        onTabChange={setActiveTab}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <main
        className={`main-content ${isHome ? "main-content--with-tabs" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/mesas" />} />
          <Route
            path="/mesas"
            element={
              <HomePage activeTab={activeTab} setActiveTab={setActiveTab} />
            }
          />
          <Route path="/cardapio" element={<ProductsPage />} />
          <Route
            path="/pedidos/recentes"
            element={<OrdersPage filter="recent" />}
          />
          <Route
            path="/pedidos/cancelados"
            element={<OrdersPage filter="canceled" />}
          />
          <Route
            path="/pedidos/finalizados"
            element={<OrdersPage filter="finished" />}
          />
          <Route path="*" element={<Navigate to="/mesas" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={() => {
          setLoggedIn(true);
        }}
      />
    );
  }

  return <AppInner onLogout={handleLogout} />;
}
