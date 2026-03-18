import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, StatusBadge, Loader, ErrorMessage, EmptyState, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './Relatorios.css';

/**
 * Página de Relatórios
 * Visão geral do casamento, convidados e checklist
 */
function Relatorios() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return <Loader text="Carregando relatórios..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const { casamento, convidados, cerimonia } = data;

  // Filtra convidados
  const filteredGuests = convidados.filter(guest => {
    const matchesFilter = filter === 'todos' 
      || (filter === 'confirmados' && guest.confirmado)
      || (filter === 'pendentes' && !guest.confirmado);
    
    const matchesSearch = guest.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Cálculos para métricas
  const totalConfirmados = convidados.filter(g => g.confirmado).length;
  const totalAcompanhantes = convidados.reduce((acc, g) => acc + g.acompanhantes, 0);
  const checklistCompletos = cerimonia.checklistItems.filter(i => i.concluido).length;
  const checklistTotal = cerimonia.checklistItems.length;

  // Navega para detalhes do convidado
  const handleViewGuest = (guestId) => {
    navigate(`/casamento/${id}/convidado/${guestId}`);
  };

  return (
    <div className="relatorios-page animate-fade-in">
      <header className="relatorios-page__header">
        <div>
          <h1>Relatórios</h1>
          <p className="relatorios-page__subtitle">Visão geral e lista de convidados</p>
        </div>
        <Tooltip content="Voltar para o dashboard">
          <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${id}`)}>
            ← Voltar
          </Button>
        </Tooltip>
      </header>

      {/* Métricas */}
      <section className="relatorios-page__metrics">
        <div className="metric-card">
          <span className="metric-card__icon">👥</span>
          <div className="metric-card__content">
            <span className="metric-card__value">{casamento.totalConvidados}</span>
            <span className="metric-card__label">Total de Convidados</span>
          </div>
        </div>
        <div className="metric-card metric-card--success">
          <span className="metric-card__icon">✓</span>
          <div className="metric-card__content">
            <span className="metric-card__value">{totalConfirmados}</span>
            <span className="metric-card__label">Confirmados</span>
          </div>
        </div>
        <div className="metric-card metric-card--warning">
          <span className="metric-card__icon">◷</span>
          <div className="metric-card__content">
            <span className="metric-card__value">{casamento.totalConvidados - totalConfirmados}</span>
            <span className="metric-card__label">Pendentes</span>
          </div>
        </div>
        <div className="metric-card metric-card--info">
          <span className="metric-card__icon">👨‍👩‍👧‍👦</span>
          <div className="metric-card__content">
            <span className="metric-card__value">{totalConfirmados + totalAcompanhantes}</span>
            <span className="metric-card__label">Pessoas Totais</span>
          </div>
        </div>
      </section>

      {/* Progresso Geral */}
      <section className="relatorios-page__progress">
        <Card title="Progresso Geral" icon="📊">
          <div className="progress-bars">
            <div className="progress-item">
              <div className="progress-item__header">
                <span>Confirmações de Presença</span>
                <span>{Math.round((totalConfirmados / casamento.totalConvidados) * 100)}%</span>
              </div>
              <div className="progress-item__bar">
                <div 
                  className="progress-item__fill progress-item__fill--primary"
                  style={{ width: `${(totalConfirmados / casamento.totalConvidados) * 100}%` }}
                />
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-item__header">
                <span>Checklist da Cerimônia</span>
                <span>{Math.round((checklistCompletos / checklistTotal) * 100)}%</span>
              </div>
              <div className="progress-item__bar">
                <div 
                  className="progress-item__fill progress-item__fill--success"
                  style={{ width: `${(checklistCompletos / checklistTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Lista de Convidados */}
      <section className="relatorios-page__guests">
        <Card 
          title="Lista de Convidados" 
          icon="📋"
          headerAction={
            <div className="guests-filter">
              <Tooltip content="Filtrar por status">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="guests-filter__select"
                >
                  <option value="todos">Todos</option>
                  <option value="confirmados">Confirmados</option>
                  <option value="pendentes">Pendentes</option>
                </select>
              </Tooltip>
            </div>
          }
        >
          <div className="guests-search">
            <input 
              type="search"
              placeholder="Buscar convidado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="guests-search__input"
            />
          </div>

          {filteredGuests.length === 0 ? (
            <EmptyState 
              icon="🔍"
              title="Nenhum convidado encontrado"
              description={searchTerm 
                ? `Não encontramos convidados com "${searchTerm}".`
                : 'Não há convidados nesta categoria.'
              }
              action={
                searchTerm && (
                  <Button variant="ghost" size="small" onClick={() => setSearchTerm('')}>
                    Limpar busca
                  </Button>
                )
              }
            />
          ) : (
            <div className="guests-table-wrapper">
              <table className="guests-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Acompanhantes</th>
                    <th>Mesa</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="guests-table__name">{guest.nome}</td>
                      <td>{guest.telefone}</td>
                      <td className="guests-table__center">
                        {guest.acompanhantes > 0 ? `+${guest.acompanhantes}` : '-'}
                      </td>
                      <td className="guests-table__center">
                        {guest.mesa || '-'}
                      </td>
                      <td>
                        <StatusBadge 
                          status={guest.confirmado ? 'confirmado' : 'pendente'} 
                          size="small"
                        />
                      </td>
                      <td>
                        <Tooltip content="Ver detalhes do convidado">
                          <button 
                            className="guests-table__action"
                            onClick={() => handleViewGuest(guest.id)}
                            aria-label={`Ver detalhes de ${guest.nome}`}
                          >
                            👁️
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="guests-summary">
            Exibindo {filteredGuests.length} de {convidados.length} convidados
            <span className="guests-summary__hint"> • Clique em 👁️ para ver detalhes</span>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Relatorios;
