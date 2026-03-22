import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import LoginPage from "./pages/Login/Login";
import HomePage from "./pages/Home/HomePage";
import ProductsPage from "./pages/Products/ProductsPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import TeamPage from "./pages/Team/TeamPage";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import { getRole } from "./services/api";

function OperationalApp({ onLogout }) {
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
                role="RECEPTION"
            />
            {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
            <main className={`main-content ${isHome ? "main-content--with-tabs" : ""}`}>
                <Routes>
                    <Route path="/" element={<Navigate to="/mesas" />} />
                    <Route path="/mesas" element={<HomePage activeTab={activeTab} setActiveTab={setActiveTab} />} />
                    <Route path="/pedidos/recentes" element={<OrdersPage filter="recent" />} />
                    <Route path="/pedidos/cancelados" element={<OrdersPage filter="canceled" />} />
                    <Route path="/pedidos/finalizados" element={<OrdersPage filter="finished" />} />
                    <Route path="*" element={<Navigate to="/mesas" />} />
                </Routes>
            </main>
        </div>
    );
}

function ManagerApp({ onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="app">
            <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={onLogout}
                role="MANAGER"
            />
            {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/gerenciamento" />} />
                    <Route path="/gerenciamento" element={<ManagerDashboard />} />
                    <Route path="/cardapio" element={<ProductsPage />} />
                    <Route path="/equipe" element={<TeamPage />} />
                    <Route path="/pedidos/recentes" element={<OrdersPage filter="recent" />} />
                    <Route path="/pedidos/cancelados" element={<OrdersPage filter="canceled" />} />
                    <Route path="/pedidos/finalizados" element={<OrdersPage filter="finished" />} />
                    <Route path="*" element={<Navigate to="/gerenciamento" />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem("token"));
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            sessionStorage.setItem("token", token);
            localStorage.removeItem("token");
        }
        if (sessionStorage.getItem("token")) {
            setRole(getRole());
        }
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
        setRole(getRole());
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setLoggedIn(false);
        setRole(null);
    };

    if (!loggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (role === "OWNER") {
        return <OwnerDashboard onLogout={handleLogout} />;
    }

    if (role === "MANAGER") {
        return <ManagerApp onLogout={handleLogout} />;
    }

    return <OperationalApp onLogout={handleLogout} />;
}