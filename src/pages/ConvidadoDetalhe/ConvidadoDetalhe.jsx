import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, StatusBadge, Loader, ErrorMessage, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './ConvidadoDetalhe.css';

/**
 * Página de Detalhes do Convidado
 * Demonstra uso do useParams para rotas dinâmicas
 */
function ConvidadoDetalhe() {
  // useParams - pega os IDs da URL
  const { casamentoId, id } = useParams();
  
  // useNavigate - para navegação programática
  const navigate = useNavigate();
  
  // useLocation - informações da rota atual
  const location = useLocation();
  
  const { data, loading, error, refetch } = useWeddingData('convidados');

  if (loading) {
    return <Loader text="Carregando dados do convidado..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  // Busca o convidado pelo ID da URL
  const convidado = data.find(c => c.id === parseInt(id));

  const currentIndex = data.findIndex(c => c.id === parseInt(id));
  const nextGuest = currentIndex >= 0 ? data[currentIndex + 1] : null;

  // Se não encontrou o convidado
  if (!convidado) {
    return (
      <div className="convidado-detalhe animate-fade-in">
        <ErrorMessage 
          title="Convidado não encontrado"
          message={`Não encontramos um convidado com o ID ${id}.`}
          onRetry={() => navigate(`/casamento/${casamentoId}/relatorios`)}
        />
      </div>
    );
  }

  return (
    <div className="convidado-detalhe animate-fade-in">
      <header className="convidado-detalhe__header">
        <div>
          <h1>Detalhes do Convidado</h1>
          <p className="convidado-detalhe__breadcrumb">
            <span>Rota atual: </span>
            <code>{location.pathname}</code>
            <span> | ID: </span>
            <code>{id}</code>
          </p>
        </div>
        <div className="convidado-detalhe__actions">
          <Tooltip content="Voltar para lista de convidados">
            <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${casamentoId}/relatorios`)}>
              ← Voltar
            </Button>
          </Tooltip>
          <Tooltip content="Navegar para o próximo convidado">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => nextGuest && navigate(`/casamento/${casamentoId}/convidado/${nextGuest.id}`)}
              disabled={!nextGuest}
            >
              Próximo →
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="convidado-detalhe__content">
        <Card 
          title={convidado.nome} 
          icon="👤"
          variant={convidado.confirmado ? 'success' : 'warning'}
        >
          <div className="convidado-info">
            <div className="convidado-info__avatar">
              {convidado.nome.charAt(0).toUpperCase()}
            </div>
            
            <div className="convidado-info__details">
              <div className="convidado-info__field">
                <label>Nome Completo</label>
                <p>{convidado.nome}</p>
              </div>
              
              <div className="convidado-info__field">
                <label>Telefone</label>
                <p>
                  <a href={`tel:${convidado.telefone.replace(/\D/g, '')}`}>
                    📞 {convidado.telefone}
                  </a>
                </p>
              </div>
              
              <div className="convidado-info__row">
                <div className="convidado-info__field">
                  <label>Acompanhantes</label>
                  <p className="convidado-info__number">
                    {convidado.acompanhantes > 0 ? `+${convidado.acompanhantes}` : 'Nenhum'}
                  </p>
                </div>
                
                <div className="convidado-info__field">
                  <label>Mesa</label>
                  <p className="convidado-info__number">
                    {convidado.mesa ? `Mesa ${convidado.mesa}` : 'Não definida'}
                  </p>
                </div>
              </div>
              
              <div className="convidado-info__field">
                <label>Status de Confirmação</label>
                <StatusBadge 
                  status={convidado.confirmado ? 'confirmado' : 'pendente'} 
                  size="large"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Info sobre os hooks utilizados */}
        <Card title="Hooks do React Router utilizados" icon="🪝" className="convidado-detalhe__hooks-info">
          <ul className="hooks-list">
            <li>
              <strong>useParams()</strong>
              <span>Captura o parâmetro <code>:id</code> da URL</span>
              <code>const {'{ id }'} = useParams(); // id = {id}</code>
            </li>
            <li>
              <strong>useNavigate()</strong>
              <span>Navega programaticamente entre rotas</span>
              <code>navigate('/relatorios');</code>
            </li>
            <li>
              <strong>useLocation()</strong>
              <span>Acessa informações da rota atual</span>
              <code>location.pathname = "{location.pathname}"</code>
            </li>
          </ul>
        </Card>
      </div>

      {/* Navegação rápida entre convidados */}
      <nav className="convidado-detalhe__nav">
        <h3>Navegação Rápida</h3>
        <div className="convidado-detalhe__nav-list">
          {data.map((c) => (
            <Tooltip key={c.id} content={c.nome}>
              <button
                className={`nav-dot ${c.id === parseInt(id) ? 'is-active' : ''} ${c.confirmado ? 'is-confirmed' : ''}`}
                onClick={() => navigate(`/casamento/${casamentoId}/convidado/${c.id}`)}
                aria-label={`Ver ${c.nome}`}
              >
                {c.id}
              </button>
            </Tooltip>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default ConvidadoDetalhe;
