import { useEffect } from 'react';
import './Toast.css';

/**
 * Notificação toast para feedback de ações
 * Usado em: após salvar, atualizar, excluir itens
 */
function Toast({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose,
  duration = 3000 
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ'
  };

  return (
    <div className={`toast toast--${type} animate-slide-up`} role="alert">
      <span className="toast__icon" aria-hidden="true">{icons[type]}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Fechar notificação">
        ✕
      </button>
    </div>
  );
}

export default Toast;
