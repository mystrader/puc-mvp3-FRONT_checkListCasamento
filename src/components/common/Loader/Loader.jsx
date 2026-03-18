import './Loader.css';

/**
 * Indicador de carregamento pixel art
 * Usado em: todas as páginas durante fetch de dados
 */
function Loader({ size = 'medium', text = 'Carregando...' }) {
  return (
    <div className={`loader loader--${size}`} role="status" aria-live="polite">
      <div className="loader__hearts">
        <span className="loader__heart">♥</span>
        <span className="loader__heart">♥</span>
        <span className="loader__heart">♥</span>
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
}

export default Loader;
