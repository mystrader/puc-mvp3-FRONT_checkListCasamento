import Button from '../Button';
import './ErrorMessage.css';

/**
 * Componente para exibir mensagens de erro
 * Usado em: todas as páginas (erro ao carregar dados)
 */
function ErrorMessage({ 
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um problema ao buscar as informações. Por favor, tente novamente.',
  onRetry = null 
}) {
  return (
    <div className="error-message animate-fade-in" role="alert">
      <span className="error-message__icon" aria-hidden="true">⚠</span>
      <h3 className="error-message__title">{title}</h3>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
