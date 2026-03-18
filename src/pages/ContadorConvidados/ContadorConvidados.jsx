import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, ErrorMessage, Loader, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import { fetchCounter, updateCounter } from '../../services/api';
import './ContadorConvidados.css';

function ContadorConvidados() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [counterLoading, setCounterLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCounter() {
      try {
        const remoteCounter = await fetchCounter(id);
        if (!ignore) {
          setCount(remoteCounter.count || 0);
          setHistory(remoteCounter.history || []);
        }
      } finally {
        if (!ignore) {
          setCounterLoading(false);
        }
      }
    }

    loadCounter();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (counterLoading) {
      return;
    }

    updateCounter(id, { count, history }).catch((counterError) => {
      console.error(counterError);
    });
  }, [count, counterLoading, history, id]);

  if (loading || counterLoading) {
    return <Loader text="Carregando contador..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const casamentos = data.casamentos || [];
  const casamento = casamentos.find((item) => item.id === parseInt(id, 10)) || data.casamento;

  if (!casamento) {
    return (
      <ErrorMessage
        title="Casamento não encontrado"
        message={`Não encontramos um casamento com o ID ${id}.`}
        onRetry={() => navigate('/')}
      />
    );
  }

  const total = casamento.totalConvidados || 0;
  const progress = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
  const excedente = total > 0 && count > total ? count - total : 0;

  const increment = () => {
    setCount((current) => current + 1);
    setHistory((current) => [...current, { type: 'inc', at: Date.now() }]);
  };

  const decrement = () => {
    setCount((current) => (current > 0 ? current - 1 : 0));
    setHistory((current) => [...current, { type: 'dec', at: Date.now() }]);
  };

  const undoLast = () => {
    setHistory((current) => {
      if (current.length === 0) {
        return current;
      }

      const last = current[current.length - 1];
      if (last.type === 'inc') {
        setCount((value) => (value > 0 ? value - 1 : 0));
      } else if (last.type === 'dec') {
        setCount((value) => value + 1);
      }

      return current.slice(0, -1);
    });
  };

  const reset = () => {
    setCount(0);
    setHistory([]);
  };

  return (
    <div className="contador-page animate-fade-in">
      <header className="contador-page__header">
        <div>
          <h1>Contador de Convidados</h1>
          <p className="contador-page__subtitle">Clique para somar e ajuste se errar</p>
        </div>
        <div className="contador-page__actions">
          <Tooltip content="Voltar para o dashboard">
            <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${id}`)}>
              Voltar
            </Button>
          </Tooltip>
        </div>
      </header>

      <section>
        <Card
          title="Contagem"
          icon="👥"
          headerAction={(
            <div className={`progress-indicator ${excedente > 0 ? 'is-over' : ''}`} aria-label="Progresso de convidados">
              <span className="progress-indicator__text">{count}/{total}</span>
              {excedente > 0 && <span className="progress-indicator__extra">+{excedente}</span>}
              <div
                className="progress-indicator__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={Math.min(count, total)}
                aria-valuetext={`${Math.min(count, total)}/${total}${excedente > 0 ? ` (+${excedente})` : ''}`}
              >
                <div className="progress-indicator__fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        >
          <div className="contador">
            <div className="contador__value" aria-live="polite" aria-atomic="true">{count}</div>
            {excedente > 0 && <div className="contador__exceed" role="status">Excedeu {excedente}</div>}
            <div className="contador__buttons">
              <div className="contador__row contador__row--primary">
                <Tooltip content="Adicionar 1">
                  <Button variant="success" size="large" onClick={increment}>+1</Button>
                </Tooltip>
                <Tooltip content="Remover 1">
                  <Button variant="danger" size="large" onClick={decrement} disabled={count === 0}>-1</Button>
                </Tooltip>
              </div>
              <div className="contador__row contador__row--secondary">
                <Tooltip content="Desfazer último clique">
                  <Button variant="ghost" size="large" onClick={undoLast} disabled={history.length === 0}>Desfazer</Button>
                </Tooltip>
                <Tooltip content="Zerar contagem">
                  <Button variant="secondary" size="large" onClick={reset} disabled={count === 0 && history.length === 0}>Zerar</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <Card title="Últimas ações" icon="🕒">
          {history.length === 0 ? (
            <p className="contador__empty">Sem ações registradas ainda.</p>
          ) : (
            <ul className="contador__history" aria-label="Histórico de ações">
              {history.slice(-10).reverse().map((item, index) => (
                <li key={index} className="contador__history-item">
                  <span className={`contador__history-badge ${item.type === 'inc' ? 'is-inc' : 'is-dec'}`}>
                    {item.type === 'inc' ? '+1' : '-1'}
                  </span>
                  <span className="contador__history-time">{new Date(item.at).toLocaleTimeString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

export default ContadorConvidados;
