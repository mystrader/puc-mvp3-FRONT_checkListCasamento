import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

/**
 * Layout principal da aplicação
 * Engloba Header e área de conteúdo
 */
function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
      <footer className="layout__footer">
        <p>💕 Wedding Ceremony System © 2025</p>
      </footer>
    </div>
  );
}

export default Layout;
