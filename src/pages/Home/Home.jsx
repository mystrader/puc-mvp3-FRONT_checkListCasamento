import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Loader, ErrorMessage, EmptyState, Tooltip, Toast } from '../../components';
import { useWeddingData, useToast } from '../../hooks';
import { deleteWedding } from '../../services/api';
import './Home.css';

function IconTrashOutlined({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

/**
 * Página inicial - Lista de Casamentos
 * Exibe todos os casamentos cadastrados
 */
function Home() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useWeddingData('casamentos');
  const { toast, success, error: showError, hideToast } = useToast();
  const [deletingId, setDeletingId] = useState(null);
  const [optimisticRemoved, setOptimisticRemoved] = useState(() => new Set());

  const handleDelete = async (e, casamento) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `Excluir o casamento de ${casamento.noiva.nome.split(' ')[0]} e ${casamento.noivo.nome.split(' ')[0]}? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }
    setDeletingId(casamento.id);
    try {
      await deleteWedding(casamento.id);
      setOptimisticRemoved((prev) => new Set(prev).add(casamento.id));
      success('Casamento removido.');
      refetch();
    } catch (err) {
      showError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loader text="Carregando casamentos..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const casamentos = (data || []).filter((c) => !optimisticRemoved.has(c.id));

  return (
    <div className="home-page animate-fade-in">
      <header className="home-page__header">
        <div className="home-page__title-area">
          <h1>Casamentos</h1>
          <p className="home-page__subtitle">
            Gerencie todos os eventos cadastrados
          </p>
        </div>
        
        {/* Ilustração pixel art */}
        <div className="home-page__illustration" aria-hidden="true">
          <div className="pixel-rings">
            <span className="pixel-ring">💍</span>
            <span className="pixel-heart">♥</span>
            <span className="pixel-ring">💍</span>
          </div>
        </div>
      </header>

      {/* Estatísticas gerais */}
      <section className="home-page__stats">
        <div className="stat-box">
          <span className="stat-box__value">{casamentos.length}</span>
          <span className="stat-box__label">Total de Casamentos</span>
        </div>
        <div className="stat-box stat-box--success">
          <span className="stat-box__value">
            {casamentos.filter(c => c.status === 'confirmado').length}
          </span>
          <span className="stat-box__label">Confirmados</span>
        </div>
        <div className="stat-box stat-box--warning">
          <span className="stat-box__value">
            {casamentos.filter(c => c.status === 'pendente').length}
          </span>
          <span className="stat-box__label">Pendentes</span>
        </div>
      </section>

      {/* Lista de casamentos */}
      <section className="home-page__list">
        <div className="home-page__list-header">
          <h2>Próximos Eventos</h2>
          <Tooltip content="Cadastrar novo evento">
            <Button variant="primary" size="small" onClick={() => navigate('/casamento/novo')}>
              + Novo Casamento
            </Button>
          </Tooltip>
        </div>

        {casamentos.length === 0 ? (
          <EmptyState 
            icon="💒"
            title="Nenhum casamento cadastrado"
            description="Comece cadastrando o primeiro evento."
            action={
              <Button variant="primary" onClick={() => navigate('/casamento/novo')}>
                + Cadastrar Casamento
              </Button>
            }
          />
        ) : (
          <div className="wedding-cards">
            {casamentos.map((casamento, index) => (
              <Card 
                key={casamento.id}
                hoverable
                onClick={() => navigate(`/casamento/${casamento.id}`)}
                className="wedding-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="wedding-card__content">
                  <div className="wedding-card__avatar">
                    <span>💑</span>
                  </div>
                  
                  <div className="wedding-card__info">
                    <h3 className="wedding-card__names">
                      {casamento.noiva.nome.split(' ')[0]} & {casamento.noivo.nome.split(' ')[0]}
                    </h3>
                    <p className="wedding-card__date">
                      📅 {new Date(casamento.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="wedding-card__location">
                      📍 {casamento.local.nome}
                    </p>
                  </div>

                  <div className="wedding-card__meta">
                    <Tooltip content="Excluir casamento">
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        className="wedding-card__delete"
                        disabled={deletingId === casamento.id}
                        onClick={(e) => handleDelete(e, casamento)}
                        aria-label="Excluir casamento"
                      >
                        {deletingId === casamento.id ? (
                          <span className="wedding-card__delete-spinner" aria-hidden>
                            …
                          </span>
                        ) : (
                          <IconTrashOutlined className="wedding-card__delete-icon" />
                        )}
                      </Button>
                    </Tooltip>
                    <StatusBadge status={casamento.status} />
                    <div className="wedding-card__guests">
                      <span className="wedding-card__guests-confirmed">
                        {casamento.convidadosConfirmados}
                      </span>
                      <span className="wedding-card__guests-total">
                        / {casamento.totalConvidados} convidados
                      </span>
                    </div>
                  </div>
                </div>

                <div className="wedding-card__progress">
                  <div 
                    className="wedding-card__progress-bar"
                    style={{ 
                      width: `${(casamento.convidadosConfirmados / casamento.totalConvidados) * 100}%` 
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

export default Home;
