import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, ErrorMessage, Loader, StatusBadge, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './Dashboard.css';

/**
 * Página de Detalhes do Casamento (Dashboard)
 * Exibe cards de status das principais áreas do casamento selecionado
 */
function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();
  const [customCouple, setCustomCouple] = useState(null);

  // Mapeamento de ícones para cada card
  const iconMap = {
    rings: '💍',
    users: '👥',
    church: '💒',
    party: '🎉'
  };

  // Mapeamento de rotas
  const routeMap = {
    casamento: `/casamento/${id}/casal`,
    convidados: `/casamento/${id}/relatorios`,
    cerimonia: `/casamento/${id}/cerimonia`,
    recepcao: `/casamento/${id}/recepcao`
  };

  if (loading) {
    return <Loader text="Carregando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  // Busca o casamento pelo ID ou usa o primeiro
  const casamentos = data.casamentos || [];
  const casamento = casamentos.find(c => c.id === parseInt(id)) || data.casamento;
  const { dashboard } = data;

  const rjCouples = [
    {
      noiva: { nome: 'Camila Souza', celular: '(21) 99812-3456', email: 'camila.souza@example.com' },
      noivo: { nome: 'Thiago Nascimento', celular: '(21) 98765-4321', email: 'thiago.nascimento@example.com' },
      local: { nome: 'Casa de Festas Jardim Oceânico', cidade: 'Rio de Janeiro - RJ' }
    },
    {
      noiva: { nome: 'Larissa Almeida', celular: '(21) 99777-8899', email: 'larissa.almeida@example.com' },
      noivo: { nome: 'Pedro Carvalho', celular: '(21) 99666-7788', email: 'pedro.carvalho@example.com' },
      local: { nome: 'Espaço Vista Mar - Barra', cidade: 'Rio de Janeiro - RJ' }
    },
    {
      noiva: { nome: 'Isabela Ribeiro', celular: '(21) 99520-3040', email: 'isabela.ribeiro@example.com' },
      noivo: { nome: 'Bruno Martins', celular: '(21) 99410-2030', email: 'bruno.martins@example.com' },
      local: { nome: 'Solar das Palmeiras', cidade: 'Rio de Janeiro - RJ' }
    }
  ];

  const randomizeCouple = () => {
    const pick = rjCouples[Math.floor(Math.random() * rjCouples.length)];
    setCustomCouple(pick);
  };

  const displayNoiva = customCouple?.noiva?.nome || casamento.noiva.nome;
  const displayNoivo = customCouple?.noivo?.nome || casamento.noivo.nome;
  const displayLocal = customCouple?.local?.nome || casamento.local.nome;

  if (!casamento) {
    return (
      <ErrorMessage 
        title="Casamento não encontrado"
        message={`Não encontramos um casamento com o ID ${id}.`}
        onRetry={() => navigate('/')}
      />
    );
  }

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard__header">
        <div className="dashboard__title-area">
          <div className="dashboard__breadcrumb">
            <Button 
              variant="ghost" 
              size="small" 
              className="dashboard__back-button" 
              onClick={() => navigate('/')} 
              aria-label="Voltar para Casamentos"
            >
              ← Casamentos
            </Button>
            <Button 
              variant="primary" 
              size="small" 
              className="dashboard__export-button" 
              onClick={() => navigate(`/casamento/${id}/exportar`)}
              aria-label="Exportar planejamento"
            >
              Exportar
            </Button>
          </div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">
            Gerenciamento do casamento
          </p>
        </div>
        
        {/* Ilustração pixel art dos noivos */}
        <div className="dashboard__couple-art" aria-hidden="true">
          <div className="pixel-couple">
            <div className="pixel-person pixel-groom">
              <div className="pixel-head"></div>
              <div className="pixel-body"></div>
            </div>
            <div className="pixel-heart">♥</div>
            <div className="pixel-person pixel-bride">
              <div className="pixel-head"></div>
              <div className="pixel-body pixel-dress"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Info do casamento */}
      <section className="dashboard__wedding-info">
        <Card variant="primary">
          <div className="wedding-summary">
            <div className="wedding-summary__names" title="Clique para variar casal (RJ)" onClick={randomizeCouple} role="button" aria-label="Variar casal (RJ)">
              <span className="wedding-summary__heart">💕</span>
              <h2>{displayNoiva.split(' ')[0]} & {displayNoivo.split(' ')[0]}</h2>
            </div>
            <div className="wedding-summary__details">
              <p>
                <strong>📅 Data:</strong> {new Date(casamento.data).toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p><strong>🕐 Cerimônia:</strong> {casamento.horarioCerimonia}h</p>
              <p><strong>📍 Local:</strong> {displayLocal}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Cards de status */}
      <section className="dashboard__cards">
        <h2 className="sr-only">Status das áreas</h2>
        <div className="dashboard__cards-grid">
          {dashboard.cards.map((card, index) => (
            <Card 
              key={card.id}
              hoverable
              onClick={() => navigate(routeMap[card.id])}
              className={`dashboard__card animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="dashboard__card-content">
                <Tooltip content={`Clique para ver detalhes de ${card.titulo}`}>
                  <span className="dashboard__card-icon">
                    {iconMap[card.icone]}
                  </span>
                </Tooltip>
                <div className="dashboard__card-info">
                  <h3 className="dashboard__card-title">{card.titulo}</h3>
                  <p className="dashboard__card-text">{card.info}</p>
                </div>
                <StatusBadge status={card.status} size="small" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Resumo rápido */}
      <section className="dashboard__stats">
        <h2 className="dashboard__section-title">Resumo Rápido</h2>
        <div className="dashboard__stats-grid">
          <div className="stat-item">
            <span className="stat-item__value">{casamento.convidadosConfirmados}</span>
            <span className="stat-item__label">Confirmados</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">{casamento.totalConvidados - casamento.convidadosConfirmados}</span>
            <span className="stat-item__label">Pendentes</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">{Math.round((casamento.convidadosConfirmados / casamento.totalConvidados) * 100)}%</span>
            <span className="stat-item__label">Taxa de Confirmação</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
