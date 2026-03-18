import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, ErrorMessage, Loader, Tooltip } from '../../components';
import { useWeddingData } from '../../hooks';
import './Exportar.css';

function Exportar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();

  useEffect(() => {
    document.title = 'CheckList Wedding - Exportar';
  }, []);

  if (loading) {
    return <Loader text="Preparando exportação..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const casamentos = data?.casamentos || [];
  const casamento = casamentos.find(c => c.id === parseInt(id)) || data?.casamento;
  const recepcao = data?.recepcao;

  const imprimir = () => {
    window.print();
  };


  const formatDateLong = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="export-page">
      <header className="export-page__header no-print">
        <div className="export-page__title">
          <h1>Exportar Documento</h1>
          <p>Checklist Wedding by Incomparável Eventos</p>
        </div>
        <div className="export-page__actions">
          <Tooltip content="Voltar para a cerimônia">
            <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${id}/cerimonia`)}>← Voltar</Button>
          </Tooltip>
          <Tooltip content="Imprimir ou salvar em PDF">
            <Button variant="primary" size="small" onClick={imprimir}>🖨️ Imprimir</Button>
          </Tooltip>
        </div>
      </header>

      <section className="export-section">
        <Card title="Dados do Casal" icon="💍" className="export-card">
          <div className="export-grid">
            <div><strong>Noiva:</strong> {casamento.noiva.nome}</div>
            <div><strong>Noivo:</strong> {casamento.noivo.nome}</div>
            <div><strong>Celular noiva:</strong> {casamento.noiva.celular}</div>
            <div><strong>Celular noivo:</strong> {casamento.noivo.celular}</div>
            <div><strong>Data do casamento:</strong> {formatDateLong(casamento.data)}</div>
            <div><strong>Horário da cerimônia:</strong> {casamento.horarioCerimonia}</div>
            <div><strong>Horário da recepção:</strong> {casamento.horarioRecepcao}</div>
            <div><strong>Local:</strong> {`${casamento.local.nome} - ${casamento.local.endereco}, ${casamento.local.cidade}`}</div>
            <div><strong>Com efeito civil?</strong> Não informado</div>
            <div><strong>Nº convidados:</strong> {casamento.totalConvidados}</div>
          </div>
        </Card>
      </section>

      <section className="export-section">
        <Card title="Itens Especiais" icon="✨" className="export-card">
          <ul className="export-list">
            <li><strong>Lágrimas de alegria:</strong> Sim (150 unid.)</li>
            <li><strong>Arroz:</strong> Não</li>
            <li><strong>Pétalas:</strong> Sim (200 unid.)</li>
            <li><strong>Cestinha daminha:</strong> Sim (2 unid.)</li>
            <li><strong>Porta-alianças:</strong> Almofada bordada</li>
            <li className="export-divider"></li>
            <li><strong>Quem vai entregar a noiva?</strong> Pai da noiva - Sr. Roberto Santos</li>
            <li><strong>Flor na lapela?</strong> Sim</li>
            <li><strong>Alianças entregues por:</strong> Padrinho João vai entregar à cerimonialista</li>
            <li><strong>Iniciar sem padrinhos atrasados?</strong> Sim</li>
          </ul>
        </Card>
      </section>

      <section className="export-section">
        <Card title="Músicas Cerimônia e Cortejo" icon="🎵" className="export-card">
          <table className="export-table">
            <thead>
              <tr>
                <th>Momento</th>
                <th>Pessoa(s)</th>
                <th>Música</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1) Noivo e mãe</td><td>Noivo João com Mãe D. Maria</td><td>Ave Maria - Schubert</td></tr>
              <tr><td>2) Pais e padrinhos</td><td>Pais e padrinhos</td><td>Canon in D - Pachelbel</td></tr>
              <tr><td>3) Damas/pajens</td><td>Daminhas Sofia e Laura</td><td>A Thousand Years (instrumental)</td></tr>
              <tr><td>4) Noiva e pai</td><td>Noiva com Pai Sr. Roberto</td><td>A Thousand Years - Christina Perri</td></tr>
              <tr><td>5) Entrada alianças</td><td>Pajem Miguel</td><td>Perfect (instrumental)</td></tr>
              <tr><td>6) Assinaturas</td><td>-</td><td>Marry Me - Train</td></tr>
              <tr><td>7) Saída padrinhos</td><td>Padrinhos</td><td>Viva la Vida - Coldplay</td></tr>
              <tr><td>8) Saída noivos</td><td>Noivos saem primeiro</td><td>Happy - Pharrell Williams</td></tr>
            </tbody>
          </table>
          <div className="export-note">
            <strong>Observação:</strong> Noiva prefere cerimônia mais curta, máximo 30 minutos
          </div>
        </Card>
      </section>

      <section className="export-section">
        <Card title="Cerimonial Recepção" icon="🎉" className="export-card">
          <ol className="export-steps">
            <li>
              <div className="export-step">
                <span className="export-step__title">1) Entrada na festa - 18:00</span>
                <div><strong>Música:</strong> Uptown Funk - Bruno Mars</div>
                <div><strong>Noivos agradecem no microfone?</strong> Sim</div>
              </div>
            </li>
            <li>
              <div className="export-step">
                <span className="export-step__title">2) Fotos no bolo - 18:30</span>
                <div>Apenas dos noivos. Sem pose especial</div>
              </div>
            </li>
            <li>
              <div className="export-step">
                <span className="export-step__title">3) Abertura de pista - 19:00</span>
                <div><strong>Música:</strong> Until I Found You - Stephen Sanchez</div>
                <div><strong>Noivos vão dançar?</strong> Sim</div>
                <div><strong>Placas divertidas?</strong> Sim</div>
                <em>DJ abre, banda entra em seguida</em>
              </div>
            </li>
            <li>
              <div className="export-step">
                <span className="export-step__title">4) Hora da Gravata - 20:00</span>
                <div><strong>Objetos:</strong> Caixa PIX, Tesoura, Cachecol do noivo</div>
                <div><strong>Quem vai passar:</strong> Luciano (padrinho) / Augusto (padrinho) / Katia (a confirmar)</div>
              </div>
            </li>
            <li className="export-step--highlight">
              <div className="export-step">
                <span className="export-step__title">☕ Intervalo - 20:30</span>
                <div>Tequila - Noivos serão os tequileiros</div>
              </div>
            </li>
            <li>
              <div className="export-step">
                <span className="export-step__title">5) Hora do Buquê - 21:00</span>
                <div><strong>Noiva joga:</strong> Buquê (a confirmar se substituto ou original)</div>
                <div><strong>Noivo joga:</strong> Bebida</div>
              </div>
            </li>
          </ol>

          <div className="export-footer">
            <div><strong>Encerramento:</strong> 23:00 • Convidados precisam ir embora para entrega da casa</div>
            <div><strong>DJ:</strong> 22:00 às 22:30 com músicas de fim de festa, som baixo</div>
            <div><strong>Banda/DJ:</strong> {recepcao?.fornecedores?.bandaDj?.nome || 'Banda Som da Festa'} (19:00 às 22:00) • Intervalo: 20:30 às 21:00</div>
          </div>
        </Card>
      </section>

      <footer className="export-page__footer">
        <div>Documento gerado por CheckList Wedding - Incomparável Eventos</div>
        <div>Data de impressão: {new Date().toLocaleString('pt-BR')}</div>
      </footer>
    </div>
  );
}

export default Exportar;
