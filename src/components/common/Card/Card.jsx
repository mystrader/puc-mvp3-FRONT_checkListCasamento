import './Card.css';

/**
 * Card container com estilo pixel art
 * Usado em: Dashboard, Cerimônia, Recepção, Relatórios
 */
function Card({ 
  children, 
  title,
  subtitle,
  icon,
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  headerAction
}) {
  const CardWrapper = onClick ? 'button' : 'article';
  
  return (
    <CardWrapper 
      className={`card card--${variant} ${hoverable ? 'card--hoverable' : ''} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {(title || icon || headerAction) && (
        <header className="card__header">
          <div className="card__header-content">
            {icon && <span className="card__icon">{icon}</span>}
            <div className="card__titles">
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="card__header-action">{headerAction}</div>}
        </header>
      )}
      <div className="card__body">
        {children}
      </div>
    </CardWrapper>
  );
}

export default Card;
