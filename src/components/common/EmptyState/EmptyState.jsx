import './EmptyState.css';

/**
 * Componente para exibir quando não há dados
 * Usado em: listas de convidados, checklist, cronograma
 */
function EmptyState({ 
  icon = '📭',
  title = 'Nenhum item encontrado',
  description = 'Não há dados para exibir no momento.',
  action = null 
}) {
  return (
    <div className="empty-state animate-fade-in">
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
