import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, StatusBadge, Loader, ErrorMessage, EmptyState, Toast, Tooltip } from '../../components';
import { useWeddingData, useToast } from '../../hooks';
import './Recepcao.css';

/**
 * Página de Recepção
 * Cronograma horário e fornecedores
 */
function Recepcao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData('recepcao');
  const { toast, success, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState('cronograma');

  const handleMarkAsDone = () => {
    success('Atividade marcada como concluída!');
  };

  if (loading) {
    return <Loader text="Carregando dados da recepção..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const { cronograma, fornecedores } = data;

  // Destaque para momentos especiais
  const highlightMoments = ['Hora do buquê', 'Hora da gravata', 'Corte do bolo', 'Primeira dança'];

  return (
    <div className="recepcao-page animate-fade-in">
      <header className="recepcao-page__header">
        <div>
          <h1>Recepção</h1>
          <p className="recepcao-page__subtitle">Cronograma e fornecedores da festa</p>
        </div>
        <Tooltip content="Voltar para o dashboard">
          <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${id}`)}>
            ← Voltar
          </Button>
        </Tooltip>
      </header>

      {/* Tabs */}
      <div className="recepcao-page__tabs">
        <button 
          className={`tab-button ${activeTab === 'cronograma' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('cronograma')}
        >
          📅 Cronograma
        </button>
        <button 
          className={`tab-button ${activeTab === 'fornecedores' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('fornecedores')}
        >
          🏢 Fornecedores
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <div className="recepcao-page__content">
        {activeTab === 'cronograma' && (
          <Card title="Cronograma da Recepção" icon="⏰">
            {cronograma.length === 0 ? (
              <EmptyState 
                icon="📅"
                title="Cronograma vazio"
                description="Nenhuma atividade cadastrada."
              />
            ) : (
              <div className="timeline">
                {cronograma.map((item, index) => {
                  const isHighlight = highlightMoments.some(m => 
                    item.atividade.toLowerCase().includes(m.toLowerCase())
                  );
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`timeline__item ${isHighlight ? 'timeline__item--highlight' : ''}`}
                    >
                      <div className="timeline__time">
                        <span className="timeline__hour">{item.horario}</span>
                        <span className="timeline__duration">{item.duracao}</span>
                      </div>
                      <div className="timeline__connector">
                        <span className="timeline__dot">
                          {isHighlight ? '★' : (index + 1)}
                        </span>
                        {index < cronograma.length - 1 && <span className="timeline__line" />}
                      </div>
                      <div className="timeline__content">
                        <h3 className="timeline__title">{item.atividade}</h3>
                        <div className="timeline__footer">
                          <StatusBadge status={item.status} size="small" />
                          <Tooltip content="Marcar como concluído">
                            <button 
                              className="timeline__action"
                              onClick={() => handleMarkAsDone(item.id)}
                              aria-label="Marcar atividade como concluída"
                            >
                              ✓
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'fornecedores' && (
          <div className="fornecedores-grid">
            {Object.entries(fornecedores).map(([key, fornecedor]) => {
              const iconMap = {
                buffet: '🍽️',
                bandaDj: '🎸',
                fotografo: '📷',
                decoracao: '🌸'
              };
              const labelMap = {
                buffet: 'Buffet',
                bandaDj: 'Banda/DJ',
                fotografo: 'Fotógrafo',
                decoracao: 'Decoração'
              };

              return (
                <Card 
                  key={key}
                  title={labelMap[key]}
                  icon={iconMap[key]}
                  variant={fornecedor.confirmado ? 'success' : 'warning'}
                >
                  <div className="fornecedor-info">
                    <p className="fornecedor-info__name">{fornecedor.nome}</p>
                    <p className="fornecedor-info__contact">
                      <Tooltip content="Clique para ligar">
                        <a href={`tel:${fornecedor.contato.replace(/\D/g, '')}`}>
                          📞 {fornecedor.contato}
                        </a>
                      </Tooltip>
                    </p>
                    <StatusBadge 
                      status={fornecedor.confirmado ? 'confirmado' : 'pendente'} 
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Destaques */}
      <section className="recepcao-page__highlights">
        <h2 className="recepcao-page__section-title">Momentos Especiais</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <span className="highlight-card__icon">💐</span>
            <span className="highlight-card__title">Buquê</span>
            <span className="highlight-card__time">21:00</span>
          </div>
          <div className="highlight-card">
            <span className="highlight-card__icon">👔</span>
            <span className="highlight-card__title">Gravata</span>
            <span className="highlight-card__time">21:15</span>
          </div>
          <div className="highlight-card">
            <span className="highlight-card__icon">🎂</span>
            <span className="highlight-card__title">Bolo</span>
            <span className="highlight-card__time">20:30</span>
          </div>
          <div className="highlight-card">
            <span className="highlight-card__icon">💃</span>
            <span className="highlight-card__title">Dança</span>
            <span className="highlight-card__time">18:45</span>
          </div>
        </div>
      </section>

      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default Recepcao;
