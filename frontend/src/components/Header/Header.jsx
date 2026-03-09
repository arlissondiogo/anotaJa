import './Header.css'

const TABS = [
  { value: 'AVAILABLE',   label: 'Disponíveis' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'DELIVERY',    label: 'Delivery' },
]

export default function Header({ onMenuClick, activeTab, onTabChange }) {
  return (
    <header className="header">
      <button className="header__menu-btn" onClick={onMenuClick} aria-label="Menu">
        <span /><span /><span />
      </button>
      <div className="header__content">
        <div className="header__logo">
          🍽️ Anota<span className="header__logo--accent">Já</span>
        </div>
        {activeTab !== undefined && (
          <div className="header__tabs">
            {TABS.map(t => (
              <button
                key={t.value}
                className={`header__tab ${activeTab === t.value ? 'header__tab--active' : ''}`}
                onClick={() => onTabChange(t.value)}
              >{t.label}</button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
