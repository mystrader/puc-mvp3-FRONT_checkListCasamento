import { useNavigate } from 'react-router-dom';
import { Card, Button, StatusBadge, Loader, ErrorMessage, EmptyState, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './Home.css';

/**
 * Página inicial - Lista de Casamentos
 * Exibe todos os casamentos cadastrados
 */
function Home() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useWeddingData('casamentos');

  if (loading) {
    return <Loader text="Carregando casamentos..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const casamentos = data || [];

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
          <Tooltip content="Funcionalidade futura">
            <Button variant="primary" size="small" disabled>
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
              <Button variant="primary" disabled>
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
    </div>
  );
}

export default Home;
