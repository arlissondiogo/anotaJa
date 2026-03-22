import { useState, useEffect } from "react";
import { getUserInfo, getOrdersRecentes, getOrdersFinalizados, getEmployees } from "../../services/api";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
    const [stats, setStats] = useState({ openOrders: 0, finishedOrders: 0, employees: 0 });
    const user = getUserInfo();

    useEffect(() => {
        async function load() {
            try {
                const [open, finished, emps] = await Promise.all([
                    getOrdersRecentes(),
                    getOrdersFinalizados(),
                    getEmployees(),
                ]);
                setStats({ openOrders: open.length, finishedOrders: finished.length, employees: emps.length });
            } catch {}
        }
        load();
    }, []);

    return (
        <div className="manager-dashboard">
            <h1 className="manager-dashboard__title">Olá, {user?.ownerName || "Gerente"}!</h1>
            <p className="manager-dashboard__sub">Use o menu para navegar entre as seções.</p>

            <div className="manager-stats">
                <div className="manager-stat-card">
                    <span className="manager-stat-card__icon">📋</span>
                    <span className="manager-stat-card__value">{stats.openOrders}</span>
                    <span className="manager-stat-card__label">Pedidos em aberto</span>
                </div>
                <div className="manager-stat-card">
                    <span className="manager-stat-card__icon">✅</span>
                    <span className="manager-stat-card__value">{stats.finishedOrders}</span>
                    <span className="manager-stat-card__label">Pedidos finalizados</span>
                </div>
                <div className="manager-stat-card">
                    <span className="manager-stat-card__icon">👥</span>
                    <span className="manager-stat-card__value">{stats.employees}</span>
                    <span className="manager-stat-card__label">Funcionários</span>
                </div>
            </div>
        </div>
    );
}