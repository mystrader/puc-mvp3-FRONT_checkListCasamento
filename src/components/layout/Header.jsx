import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from '../common/Tooltip';
import './Header.css';

/**
 * Cabeçalho principal com navegação
 * Usado em: todas as páginas (componente de layout)
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Verifica se estamos dentro de um casamento
  const casamentoId = location.pathname.match(/\/casamento\/(\d+)/)?.[1];
  const isInsideCasamento = !!casamentoId;

  // Navegação principal (lista de casamentos)
  const mainNavItems = [
    { path: '/', label: 'Casamentos', icon: '🏠' },
  ];

  // Navegação dentro do casamento
  const casamentoNavItems = casamentoId ? [
    { path: `/casamento/${casamentoId}`, label: 'Dashboard', icon: '📊', end: true },
    { path: `/casamento/${casamentoId}/casal`, label: 'Casal', icon: '💑' },
    { path: `/casamento/${casamentoId}/cerimonia`, label: 'Cerimônia', icon: '💒' },
    { path: `/casamento/${casamentoId}/recepcao`, label: 'Recepção', icon: '🎉' },
    { path: `/casamento/${casamentoId}/relatorios`, label: 'Relatórios', icon: '📋' },
    { path: `/casamento/${casamentoId}/contador`, label: 'Contador', icon: '🔢' },
  ] : [];

  const navItems = isInsideCasamento ? casamentoNavItems : mainNavItems;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-icon" aria-hidden="true">💍</span>
          <span className="header__logo-text">Wedding<br/>Ceremony</span>
        </NavLink>

        <button 
          className={`header__menu-toggle ${menuOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span className="header__menu-bar"></span>
          <span className="header__menu-bar"></span>
          <span className="header__menu-bar"></span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`}>
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="header__nav-item">
                <Tooltip content={item.label} position="bottom">
                  <NavLink 
                    to={item.path} 
                    end={item.end}
                    className={({ isActive }) => 
                      `header__nav-link ${isActive ? 'is-active' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    <span className="header__nav-icon" aria-hidden="true">{item.icon}</span>
                    <span className="header__nav-label">{item.label}</span>
                  </NavLink>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
