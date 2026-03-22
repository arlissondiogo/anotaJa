import { useState, useEffect } from "react";
import { getUserInfo, getEmployees, getOrdersRecentes, getOrdersFinalizados } from "../../services/api";
import TeamPage from "../Team/TeamPage";
import "./OwnerDashboard.css";

const SECTIONS = [
  { id: "overview", label: "🏠 Visão Geral" },
  { id: "team",     label: "👥 Equipe" },
  { id: "profile",  label: "👤 Perfil" },
  { id: "reports",  label: "📊 Relatórios" },
];

export default function OwnerDashboard({ onLogout }) {
  const [section, setSection] = useState("overview");
  const [stats, setStats] = useState({ employees: 0, openOrders: 0, finishedOrders: 0 });
  const user = getUserInfo();

  useEffect(() => {
    async function load() {
      try {
        const [emps, open, finished] = await Promise.all([
          getEmployees(),
          getOrdersRecentes(),
          getOrdersFinalizados(),
        ]);
        setStats({
          employees: emps.length,
          openOrders: open.length,
          finishedOrders: finished.length,
        });
      } catch {}
    }
    load();
  }, []);

  return (
    <div className="owner-layout">
      {/* Sidebar */}
      <aside className="owner-sidebar">
        <div className="owner-sidebar__logo">
          🍽️ Anota<span>Já</span>
        </div>
        <div className="owner-sidebar__business">
          {user?.businessName || "Minha Empresa"}
        </div>
        <nav className="owner-sidebar__nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`owner-sidebar__item ${section === s.id ? "owner-sidebar__item--active" : ""}`}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <button className="owner-sidebar__logout" onClick={onLogout}>
          🚪 Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="owner-main">
        {section === "overview" && (
          <div className="owner-section">
            <h1 className="owner-section__title">Visão Geral</h1>
            <p className="owner-section__sub">Olá, {user?.ownerName || "Dono"}! Aqui está um resumo do seu negócio.</p>
            <div className="owner-stats">
              <div className="owner-stat-card">
                <span className="owner-stat-card__icon">👥</span>
                <span className="owner-stat-card__value">{stats.employees}</span>
                <span className="owner-stat-card__label">Funcionários</span>
              </div>
              <div className="owner-stat-card">
                <span className="owner-stat-card__icon">📋</span>
                <span className="owner-stat-card__value">{stats.openOrders}</span>
                <span className="owner-stat-card__label">Pedidos em aberto</span>
              </div>
              <div className="owner-stat-card">
                <span className="owner-stat-card__icon">✅</span>
                <span className="owner-stat-card__value">{stats.finishedOrders}</span>
                <span className="owner-stat-card__label">Pedidos finalizados</span>
              </div>
            </div>
          </div>
        )}

        {section === "team" && (
          <div className="owner-section">
            <TeamPage />
          </div>
        )}

        {section === "profile" && (
          <div className="owner-section">
            <h1 className="owner-section__title">Perfil</h1>
            <div className="owner-profile">
              <div className="owner-profile__avatar">
                {user?.ownerName?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="owner-profile__info">
                <div className="owner-profile__row">
                  <span className="owner-profile__label">Nome</span>
                  <span className="owner-profile__value">{user?.ownerName}</span>
                </div>
                <div className="owner-profile__row">
                  <span className="owner-profile__label">Email</span>
                  <span className="owner-profile__value">{user?.email}</span>
                </div>
                <div className="owner-profile__row">
                  <span className="owner-profile__label">Empresa</span>
                  <span className="owner-profile__value">{user?.businessName}</span>
                </div>
                <div className="owner-profile__row">
                  <span className="owner-profile__label">Perfil</span>
                  <span className="owner-profile__value owner-profile__badge">Dono</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === "reports" && (
          <div className="owner-section">
            <h1 className="owner-section__title">Relatórios</h1>
            <div className="owner-coming-soon">
              <span>📊</span>
              <p>Relatórios em breve!</p>
              <span className="owner-coming-soon__sub">Esta funcionalidade está sendo desenvolvida.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}