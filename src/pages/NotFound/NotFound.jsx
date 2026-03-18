import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components';
import './NotFound.css';

/**
 * Página 404 - Rota não encontrada
 */
function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="not-found animate-fade-in">
      <div className="not-found__content">
        <div className="not-found__icon">💔</div>
        <h1 className="not-found__title">404</h1>
        <h2 className="not-found__subtitle">Página não encontrada</h2>
        <p className="not-found__text">
          Ops! A página <code>{location.pathname}</code> não existe.
        </p>
        <div className="not-found__actions">
          <Button variant="primary" onClick={() => navigate('/')}>
            ← Voltar ao Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Voltar à página anterior
          </Button>
        </div>
      </div>
      
      <div className="not-found__decoration" aria-hidden="true">
        <span>♥</span>
        <span>♥</span>
        <span>♥</span>
      </div>
    </div>
  );
}

export default NotFound;
