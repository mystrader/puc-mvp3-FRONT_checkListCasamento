import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Loader, ErrorMessage, Toast, Tooltip } from '../../components';
import { useWeddingData, useToast } from '../../hooks';
import { fetchAddressByCep, updateWedding } from '../../services/api';
import './Casal.css';

function Casal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, refetch } = useWeddingData();
  const { toast, success, hideToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!data) {
      return;
    }

    const casamentos = data.casamentos || [];
    const casamentoSelecionado = casamentos.find((item) => item.id === parseInt(id, 10)) || data.casamento;

    if (casamentoSelecionado) {
      setFormData(casamentoSelecionado);
    }
  }, [data, id]);

  const updateSection = (section, field, value) => {
    setFormData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const updateRoot = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCepBlur = async () => {
    if (!formData?.local?.cep) {
      return;
    }

    try {
      const endereco = await fetchAddressByCep(formData.local.cep);
      setFormData((current) => ({
        ...current,
        local: {
          ...current.local,
          cep: endereco.cep,
          logradouro: endereco.logradouro || current.local.logradouro,
          bairro: endereco.bairro || current.local.bairro,
          cidadeNome: endereco.localidade || current.local.cidadeNome,
          uf: endereco.uf || current.local.uf,
          cidade: `${endereco.localidade || current.local.cidadeNome} - ${endereco.uf || current.local.uf}`,
        },
      }));
      success('Endereço preenchido automaticamente via ViaCEP.');
    } catch (cepError) {
      success(cepError.message);
    }
  };

  const handleSave = async () => {
    if (!formData) {
      return;
    }

    setSaving(true);

    try {
      const updatedWedding = await updateWedding(id, {
        noiva: formData.noiva,
        noivo: formData.noivo,
        data: formData.data,
        horarioCerimonia: formData.horarioCerimonia,
        horarioRecepcao: formData.horarioRecepcao,
        local: {
          nome: formData.local.nome,
          logradouro: formData.local.logradouro || '',
          numero: formData.local.numero || 'S/N',
          bairro: formData.local.bairro || '',
          cidadeNome: formData.local.cidadeNome || '',
          uf: formData.local.uf || '',
          cep: formData.local.cep,
        },
        status: formData.status,
        totalConvidados: formData.totalConvidados,
        convidadosConfirmados: formData.convidadosConfirmados,
        civil: formData.civil || false,
      });

      setFormData(updatedWedding);
      setEditing(false);
      success('Dados salvos com sucesso na API!');
      refetch();
    } catch (saveError) {
      success(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return <Loader text="Carregando dados do casal..." />;
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />;
  }

  const { noiva, noivo, data: dataEvento, horarioCerimonia, horarioRecepcao, local } = formData;

  return (
    <div className="casal-page animate-fade-in">
      <header className="casal-page__header">
        <div>
          <h1>Dados do Casal</h1>
          <p className="casal-page__subtitle">Informações dos noivos e do evento</p>
        </div>
        <div className="casal-page__actions">
          <Tooltip content="Voltar para o dashboard">
            <Button variant="ghost" size="small" onClick={() => navigate(`/casamento/${id}`)}>
              ← Voltar
            </Button>
          </Tooltip>
          <Tooltip content={editing ? 'Salvar alterações' : 'Editar informações'}>
            <Button variant={editing ? 'success' : 'primary'} size="small" onClick={editing ? handleSave : () => setEditing(true)}>
              {saving ? 'Salvando...' : editing ? '✓ Salvar' : '✎ Editar'}
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="casal-page__grid">
        <Card title="Noiva" icon="👰" variant="primary">
          <div className="person-info">
            <div className="person-info__field">
              <label>Nome Completo</label>
              {editing ? <input type="text" value={noiva.nome} onChange={(e) => updateSection('noiva', 'nome', e.target.value)} /> : <p>{noiva.nome}</p>}
            </div>
            <div className="person-info__field">
              <label>Celular</label>
              {editing ? <input type="tel" value={noiva.celular} onChange={(e) => updateSection('noiva', 'celular', e.target.value)} /> : <p>{noiva.celular}</p>}
            </div>
            <div className="person-info__field">
              <label>E-mail</label>
              {editing ? <input type="email" value={noiva.email} onChange={(e) => updateSection('noiva', 'email', e.target.value)} /> : <p>{noiva.email}</p>}
            </div>
          </div>
        </Card>

        <Card title="Noivo" icon="🤵" variant="secondary">
          <div className="person-info">
            <div className="person-info__field">
              <label>Nome Completo</label>
              {editing ? <input type="text" value={noivo.nome} onChange={(e) => updateSection('noivo', 'nome', e.target.value)} /> : <p>{noivo.nome}</p>}
            </div>
            <div className="person-info__field">
              <label>Celular</label>
              {editing ? <input type="tel" value={noivo.celular} onChange={(e) => updateSection('noivo', 'celular', e.target.value)} /> : <p>{noivo.celular}</p>}
            </div>
            <div className="person-info__field">
              <label>E-mail</label>
              {editing ? <input type="email" value={noivo.email} onChange={(e) => updateSection('noivo', 'email', e.target.value)} /> : <p>{noivo.email}</p>}
            </div>
          </div>
        </Card>

        <Card title="Evento" icon="📅" className="casal-page__event-card">
          <div className="event-info">
            <div className="event-info__row">
              <div className="event-info__field">
                <label>Data do Casamento</label>
                {editing ? (
                  <input type="date" value={dataEvento} onChange={(e) => updateRoot('data', e.target.value)} />
                ) : (
                  <p>{new Date(dataEvento).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}</p>
                )}
              </div>
            </div>
            <div className="event-info__row event-info__row--times">
              <div className="event-info__field">
                <label>Horário Cerimônia</label>
                {editing ? <input type="time" value={horarioCerimonia} onChange={(e) => updateRoot('horarioCerimonia', e.target.value)} /> : <p className="time-display">{horarioCerimonia}</p>}
              </div>
              <div className="event-info__field">
                <label>Horário Recepção</label>
                {editing ? <input type="time" value={horarioRecepcao} onChange={(e) => updateRoot('horarioRecepcao', e.target.value)} /> : <p className="time-display">{horarioRecepcao}</p>}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Local" icon="📍" className="casal-page__location-card">
          <div className="location-info">
            <div className="location-info__field">
              <label>Nome do Espaço</label>
              {editing ? <input type="text" value={local.nome} onChange={(e) => updateSection('local', 'nome', e.target.value)} /> : <p className="location-name">{local.nome}</p>}
            </div>
            <div className="location-info__field">
              <label>CEP</label>
              {editing ? <input type="text" value={local.cep} onChange={(e) => updateSection('local', 'cep', e.target.value)} onBlur={handleCepBlur} /> : <p>{local.cep}</p>}
            </div>
            <div className="location-info__field">
              <label>Logradouro</label>
              {editing ? <input type="text" value={local.logradouro || ''} onChange={(e) => updateSection('local', 'logradouro', e.target.value)} /> : <p>{local.endereco}</p>}
            </div>
            <div className="location-info__row">
              <div className="location-info__field">
                <label>Número</label>
                {editing ? <input type="text" value={local.numero || ''} onChange={(e) => updateSection('local', 'numero', e.target.value)} /> : <p>{local.numero || 'S/N'}</p>}
              </div>
              <div className="location-info__field">
                <label>Bairro</label>
                {editing ? <input type="text" value={local.bairro || ''} onChange={(e) => updateSection('local', 'bairro', e.target.value)} /> : <p>{local.bairro}</p>}
              </div>
            </div>
            <div className="location-info__row">
              <div className="location-info__field">
                <label>Cidade</label>
                {editing ? <input type="text" value={local.cidadeNome || ''} onChange={(e) => updateSection('local', 'cidadeNome', e.target.value)} /> : <p>{local.cidade}</p>}
              </div>
              <div className="location-info__field">
                <label>UF</label>
                {editing ? <input type="text" value={local.uf || ''} onChange={(e) => updateSection('local', 'uf', e.target.value.toUpperCase())} /> : <p>{local.uf}</p>}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

export default Casal;
