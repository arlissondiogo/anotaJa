import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = {
    RECEPTION: [
        { path: '/mesas',               label: '🍽️  Mesas' },
        { path: '/pedidos/recentes',    label: '📋  Pedidos Recentes' },
        { path: '/pedidos/cancelados',  label: '❌  Pedidos Cancelados' },
        { path: '/pedidos/finalizados', label: '✅  Pedidos Finalizados' },
    ],
    MANAGER: [
        { path: '/gerenciamento',       label: '🏠  Início' },
        { path: '/cardapio',            label: '📦  Cardápio' },
        { path: '/equipe',              label: '👥  Equipe' },
        { path: '/pedidos/recentes',    label: '📋  Pedidos Recentes' },
        { path: '/pedidos/cancelados',  label: '❌  Pedidos Cancelados' },
        { path: '/pedidos/finalizados', label: '✅  Pedidos Finalizados' },
    ],
};

export default function Sidebar({ open, onClose, onLogout, role = 'RECEPTION' }) {
    const navigate = useNavigate();
    const location = useLocation();
    const items = NAV_ITEMS[role] || NAV_ITEMS.RECEPTION;

    const handleNav = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
            {items.map(item => (
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
    );
}