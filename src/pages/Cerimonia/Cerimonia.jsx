import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorMessage, Loader, Modal, StatusBadge, Toast, Tooltip } from '../../components';
import { useToast, useWeddingData } from '../../hooks';
import { updateChecklistItem } from '../../services/api';
import './Cerimonia.css';

function Cerimonia() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData('cerimonia');
  const { toast, success, hideToast } = useToast();
  const [checklist, setChecklist] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    if (data?.checklistItems) {
      setChecklist(data.checklistItems);
    }
  }, [data]);

  const handleToggleItem = async (itemId) => {
    const currentItem = checklist.find((item) => item.id === itemId);
    if (!currentItem) {
      return;
    }

    try {
      const updatedItem = await updateChecklistItem(id, itemId, {
        ...currentItem,
        concluido: !currentItem.concluido,
      });

      setChecklist((current) => current.map((item) => (
        item.id === itemId ? updatedItem : item
      )));

      success(updatedItem.concluido
        ? `"${updatedItem.item}" marcado como concluído!`
        : `"${updatedItem.item}" desmarcado`);
    } catch (toggleError) {
      success(toggleError.message);
    }
  };

  if (loading) {
    return <Loader text="Carregando checklist da cerimônia..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const musicas = data?.musicas || [];
  const items = checklist;
  const completedCount = items.filter((item) => item.concluido).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="cerimonia-page animate-fade-in">
      <header className="cerimonia-page__header">
        <div>
          <h1>Cerimônia</h1>
          <p className="cerimonia-page__subtitle">Checklist e programação musical</p>
        </div>
        <div className="cerimonia-page__actions">
          <Tooltip content="Voltar para Casamentos">
            <Button variant="ghost" size="small" onClick={() => navigate('/')}>
              ← Voltar
            </Button>
          </Tooltip>
          <Tooltip content="Exportar documento (imprimir/Salvar PDF)">
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(`/casamento/${id}/cerimonia/exportar`)}
            >
              Exportar
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="cerimonia-page__content">
        <section className="cerimonia-page__section">
          <Card
            title="Checklist da Cerimônia"
            icon="✓"
            headerAction={(
              <div className="progress-indicator">
                <span className="progress-indicator__text">{completedCount}/{items.length}</span>
                <div className="progress-indicator__bar">
                  <div className="progress-indicator__fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          >
            {items.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Checklist vazia"
                description="Nenhum item cadastrado ainda."
              />
            ) : (
              <ul className="checklist">
                {items.map((item) => (
                  <li key={item.id} className={`checklist__item ${item.concluido ? 'is-completed' : ''}`}>
                    <button
                      className="checklist__toggle"
                      onClick={() => handleToggleItem(item.id)}
                      role="checkbox"
                      aria-checked={item.concluido}
                      aria-label={item.concluido ? `Desmarcar ${item.item}` : `Marcar ${item.item} como concluído`}
                    >
                      <span className="checklist__checkbox">{item.concluido ? '✓' : ''}</span>
                    </button>
                    <div className="checklist__content">
                      <span className="checklist__name">{item.item}</span>
                      <span className="checklist__description">{item.descricao}</span>
                    </div>
                    <div className="checklist__meta">
                      <Tooltip content={`Responsável: ${item.responsavel}`}>
                        <span className="checklist__responsible">👤 {item.responsavel}</span>
                      </Tooltip>
                      <StatusBadge status={item.concluido ? 'concluido' : 'pendente'} size="small" showIcon={false} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section className="cerimonia-page__section">
          <Card title="Programação Musical" icon="🎵">
            {musicas.length === 0 ? (
              <EmptyState
                icon="🎶"
                title="Sem músicas"
                description="Nenhuma música cadastrada para a cerimônia."
              />
            ) : (
              <ul className="music-list">
                {musicas.map((musica) => (
                  <li key={musica.id} className="music-list__item">
                    <button className="music-list__button" onClick={() => setSelectedMusic(musica)}>
                      <span className="music-list__moment">{musica.momento}</span>
                      <span className="music-list__song">{musica.musica}</span>
                      <span className="music-list__duration">{musica.duracao}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      <Modal isOpen={!!selectedMusic} onClose={() => setSelectedMusic(null)} title="Detalhes da Música" size="small">
        {selectedMusic && (
          <div className="music-detail">
            <div className="music-detail__icon">🎵</div>
            <h3 className="music-detail__moment">{selectedMusic.momento}</h3>
            <p className="music-detail__song">{selectedMusic.musica}</p>
            <p className="music-detail__duration">
              Duração: <strong>{selectedMusic.duracao}</strong>
            </p>
            <Button variant="primary" onClick={() => setSelectedMusic(null)}>
              Fechar
            </Button>
          </div>
        )}
      </Modal>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

export default Cerimonia;
