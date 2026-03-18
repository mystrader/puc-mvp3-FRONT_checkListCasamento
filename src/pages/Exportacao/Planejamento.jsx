import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, ErrorMessage, Loader, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './Planejamento.css';

function Planejamento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();

  useEffect(() => {
    document.title = 'Planejamento Completo - Exportação';
  }, []);

  if (loading) return <Loader text="Preparando exportação..." />;
  if (error) return <ErrorMessage onRetry={refetch} />;

  const casamentos = data?.casamentos || [];
  const casamento = casamentos.find(c => c.id === parseInt(id)) || data?.casamento;
  const cerimonia = data?.cerimonia || {};
  const recepcao = data?.recepcao || {};

  const checklist = cerimonia.checklistItems || [];
  const musicas = cerimonia.musicas || [];
  const CRONOGRAMA = recepcao.cronograma || [];

  const imprimir = () => window.print();

  const formatDateLong = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const responsaveis = Object.values(
    checklist.reduce((acc, item) => {
      const key = item.responsavel || 'Indefinido';
      acc[key] = acc[key] || { nome: key, itens: [] };
      acc[key].itens.push(item.item);
      return acc;
    }, {})
  );

  return (
    <div className="plan-page">
      <header className="plan-header no-print">
        <div className="plan-header__left">
          <Tooltip content="Voltar para o Dashboard">
            <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${casamento.id}`)}>← Voltar</Button>
          </Tooltip>
        </div>
        <div className="plan-header__center">
          <h1>Planejamento Completo</h1>
          <p>Checklist Wedding by Incomparável Eventos</p>
        </div>
        <div className="plan-header__right">
          <Tooltip content="Imprimir ou salvar em PDF">
            <Button variant="primary" size="small" onClick={imprimir}>🖨️ Exportar PDF</Button>
          </Tooltip>
        </div>
      </header>

      <section className="plan-section">
        <Card title="DADOS DO CASAL" icon="💍" className="plan-card">
          <div className="plan-block">
            <div className="plan-field">
              <span className="plan-field__label">Nome da Noiva:</span>
              <span className="plan-field__fill">{casamento.noiva.nome}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Celular da Noiva:</span>
              <span className="plan-field__fill">{casamento.noiva.celular}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Nome do Noivo:</span>
              <span className="plan-field__fill">{casamento.noivo.nome}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Celular do Noivo:</span>
              <span className="plan-field__fill">{casamento.noivo.celular}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Data do Casamento:</span>
              <span className="plan-field__fill">{formatDateLong(casamento.data)}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Local da cerimônia (nome e endereço):</span>
              <span className="plan-field__fill">{`${casamento.local.nome} - ${casamento.local.endereco}, ${casamento.local.cidade}`}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Horário indicado no convite:</span>
              <span className="plan-field__fill">{casamento.horarioCerimonia || '________'}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Horário de entrada da noiva:</span>
              <span className="plan-field__fill">{casamento.horarioCerimonia || '________'}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Número de convidados pagos:</span>
              <span className="plan-field__fill">{casamento.totalConvidados}</span>
            </div>
            <div className="plan-field">
              <span className="plan-field__label">Cerimônia civil?</span>
              <span className="plan-field__fill">{casamento.civil ? 'Sim' : 'Não informado'}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="ITENS DA CERIMÔNIA" icon="🎀" className="plan-card">
          <div className="plan-list">
            <div><strong>Itens previstos (com quantidade):</strong></div>
            <div className="plan-block">
              <ul className="plan-checklist">
                <li>( ) Lágrimas de alegria</li>
                <li>( ) Arroz</li>
                <li>( ) Pétalas</li>
                <li>( ) Cestinhas de daminhas</li>
                <li>( ) Porta-alianças</li>
                <li>( ) Outros itens: __________</li>
              </ul>
            </div>
            <div className="plan-divider" />
            <div className="plan-block">
              <div className="plan-field"><span className="plan-field__label">Quem entregará os itens:</span><span className="plan-field__fill">__________</span></div>
              <div className="plan-field"><span className="plan-field__label">Responsável pela entrega dos itens:</span><span className="plan-field__fill">__________</span></div>
              <div className="plan-field"><span className="plan-field__label">Flor na lapela?</span><span className="plan-field__fill">( ) Sim ( ) Não</span></div>
              <div className="plan-field"><span className="plan-field__label">Alianças e porta-alianças serão entregues por:</span><span className="plan-field__fill">{checklist.find(i=>i.item==='Porta-alianças')?.responsavel || '__________'}</span></div>
              <div className="plan-field"><span className="plan-field__label">Nome do responsável:</span><span className="plan-field__fill">__________</span></div>
              <div className="plan-field"><span className="plan-field__label">Autorização para início sem padrinhos em atraso:</span><span className="plan-field__fill">( ) Sim ( ) Não</span></div>
            </div>
          </div>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="ROTEIRO MUSICAL – CERIMÔNIA" icon="🎼" className="plan-card">
          <h3 className="plan-subtitle">🎻 Cortejo e cerimônia</h3>
          <table className="plan-table">
            <thead>
              <tr>
                <th>Momento</th>
                <th>Música</th>
                <th>Pessoa(s)</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Entrada do noivo e mãe',
                'Entrada dos pais e padrinhos',
                'Entrada das damas / pajens / demoiselles',
                'Entrada da noiva e pai',
                'Entrada das alianças',
                'Assinaturas',
                'Saída dos padrinhos',
                'Saída dos noivos'
              ].map((momento, idx) => {
                const m = musicas[idx];
                return (
                  <tr key={momento}>
                    <td>{momento}</td>
                    <td>{m?.musica || '________'}</td>
                    <td>{m?.momento || '________'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="plan-note">
            <strong>Observações musicais:</strong>
            <div className="plan-note__box"></div>
          </div>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="PÓS-CERIMÔNIA" icon="📸" className="plan-card">
          <div className="plan-list">
            Reunir pais e padrinhos para fotos oficiais no local da cerimônia?
            <div>( ) Sim ( ) Não</div>
          </div>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="RECEPÇÃO – ROTEIRO COMPLETO" icon="🎉" className="plan-card">
          <ol className="plan-steps">
            <li>
              <div className="plan-step">
                <span className="plan-step__title">1) Entrada dos noivos na festa</span>
                <div><strong>Música:</strong> __________</div>
                <div>Entrada com: ( ) Agradecimento no microfone ( ) Apenas música alta</div>
              </div>
            </li>
            <li>
              <div className="plan-step">
                <span className="plan-step__title">2) Fotos no bolo</span>
                <div>Somente os noivos? ( ) Sim ( ) Não</div>
                <div>Pose especial? ( ) Não ( ) Sim: __________</div>
              </div>
            </li>
            <li>
              <div className="plan-step">
                <span className="plan-step__title">🕺 Cronograma da festa</span>
                <ul className="plan-timeline">
                  <li className="plan-timeline__item">
                    <div className="plan-time__hour">19h</div>
                    <div className="plan-time__content">
                      <div className="plan-time__title">Abertura da pista</div>
                      <div className="plan-time__line">Música: {musicas[3]?.musica || 'Marry Me - Train'} • ( ) Vão dançar</div>
                      <div className="plan-time__line">DJ inicia</div>
                      <div className="plan-time__line">Banda: {recepcao?.fornecedores?.bandaDj?.nome || 'Banda Som da Festa'} • 19h às 22h • Intervalo: 20h30 às 21h</div>
                      <div className="plan-time__line">Placas divertidas na pista? ( ) Sim</div>
                    </div>
                  </li>
                  <li className="plan-timeline__item">
                    <div className="plan-time__hour">20h</div>
                    <div className="plan-time__content">
                      <div className="plan-time__title">Hora da gravata</div>
                      <div className="plan-time__line">Objetos: Caixa Pix, Tesoura, Cachecol do noivo</div>
                      <div className="plan-time__line">Quem irá passar: Luciano / Augusto / Kátia / Outro: __________</div>
                    </div>
                  </li>
                  <li className="plan-timeline__item">
                    <div className="plan-time__hour">20h30</div>
                    <div className="plan-time__content">
                      <div className="plan-time__title">Hora da tequila</div>
                      <div className="plan-time__line">Noivos serão os tequila-leiros</div>
                      <div className="plan-time__line">Banda em intervalo</div>
                      <div className="plan-time__line">DJ assume</div>
                    </div>
                  </li>
                  <li className="plan-timeline__item">
                    <div className="plan-time__hour">21h</div>
                    <div className="plan-time__content">
                      <div className="plan-time__title">Hora do buquê</div>
                      <div className="plan-time__line">O que a noiva jogará: ( ) Buquê ( ) Substituto ( ) Outro</div>
                      <div className="plan-time__line">O noivo jogará: ( ) Bebida ( ) Outro</div>
                    </div>
                  </li>
                  <li className="plan-timeline__item">
                    <div className="plan-time__hour">22h</div>
                    <div className="plan-time__content">
                      <div className="plan-time__title">Encerramento</div>
                      <div className="plan-time__line">22h às 22h30 — DJ com som baixo</div>
                      <div className="plan-time__line">Até 23h — convidados devem encerrar saída</div>
                      <div className="plan-time__line">Liberação da casa</div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ol>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="OBSERVAÇÕES GERAIS" icon="📝" className="plan-card">
          <div className="plan-note__box"></div>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="LISTA DE RESPONSÁVEIS" icon="📋" className="plan-card">
          <ul className="plan-responsibles">
            {responsaveis.map((r) => (
              <li key={r.nome}>
                <strong>{r.nome}:</strong> {r.itens.join(', ')}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="plan-section">
        <Card title="RELATÓRIO DE ITENS E QUANTIDADES" icon="📄" className="plan-card">
          <table className="plan-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map(item => (
                <tr key={item.id}>
                  <td>{item.item}</td>
                  <td>{item.concluido ? 'Concluído' : 'Pendente'}</td>
                  <td>{item.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <footer className="plan-footer">
        <div>Documento gerado por CheckList Wedding - Incomparável Eventos</div>
        <div>Data de impressão: {new Date().toLocaleString('pt-BR')}</div>
      </footer>
      <div className="print-footer no-screen" />
    </div>
  );
}

export default Planejamento;
