import './StatusBadge.css';

/**
 * Badge para exibir status de itens
 * Usado em: Dashboard, Cerimônia, Recepção, Relatórios
 */
function StatusBadge({ status, size = 'medium', showIcon = true }) {
  const statusConfig = {
    confirmado: {
      label: 'Confirmado',
      icon: '✓',
      className: 'status--success'
    },
    pendente: {
      label: 'Pendente',
      icon: '◷',
      className: 'status--warning'
    },
    cancelado: {
      label: 'Cancelado',
      icon: '✕',
      className: 'status--error'
    },
    concluido: {
      label: 'Concluído',
      icon: '★',
      className: 'status--success'
    },
    atrasado: {
      label: 'Atrasado',
      icon: '!',
      className: 'status--error'
    }
  };

  const config = statusConfig[status] || statusConfig.pendente;

  return (
    <span className={`status-badge status-badge--${size} ${config.className}`}>
      {showIcon && <span className="status-badge__icon" aria-hidden="true">{config.icon}</span>}
      <span className="status-badge__label">{config.label}</span>
    </span>
  );
}

export default StatusBadge;
