import { useEffect } from 'react';
import './Modal.css';

/**
 * Modal para ações e confirmações
 * Usado em: confirmações, detalhes de itens
 */
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  showCloseButton = true 
}) {
  // Fecha com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={`modal modal--${size} animate-slide-up`}>
        <header className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          {showCloseButton && (
            <button 
              className="modal__close" 
              onClick={onClose}
              aria-label="Fechar modal"
            >
              ✕
            </button>
          )}
        </header>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
