import { useState } from 'react';
import './Tooltip.css';

/**
 * Tooltip explicativo para ícones e botões
 * Usado em: todas as páginas (ícones de ajuda, botões de ação)
 */
function Tooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 200 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div 
          className={`tooltip tooltip--${position}`}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          <span className="tooltip__content">{content}</span>
          <span className="tooltip__arrow" />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
