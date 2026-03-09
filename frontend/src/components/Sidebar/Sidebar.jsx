import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const NAV_ITEMS = [
  { path: '/mesas',              label: '🍽️  Mesas' },
  { path: '/cardapio',           label: '📦  Cardápio' },
  { path: '/pedidos/recentes',   label: '📋  Pedidos Recentes' },
  { path: '/pedidos/cancelados', label: '❌  Pedidos Cancelados' },
  { path: '/pedidos/finalizados',label: '✅  Pedidos Finalizados' },
]

export default function Sidebar({ open, onClose, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.path}
          className={`sidebar__item ${location.pathname === item.path ? 'sidebar__item--active' : ''}`}
          onClick={() => handleNav(item.path)}
        >
          {item.label}
        </button>
      ))}
      <div className="sidebar__spacer" />
      <button className="sidebar__item sidebar__item--logout" onClick={onLogout}>
        🚪  Sair
      </button>
    </aside>
  )
}
