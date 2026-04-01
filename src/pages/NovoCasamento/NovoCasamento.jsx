import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Toast, Tooltip } from '../../components';
import { useToast } from '../../hooks';
import { fetchAddressByCep, createWedding } from '../../services/api';
import '../Casal/Casal.css';

function buildInitialForm() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return {
    noiva: { nome: '', celular: '', email: '' },
    noivo: { nome: '', celular: '', email: '' },
    data: d.toISOString().slice(0, 10),
    horarioCerimonia: '16:00',
    horarioRecepcao: '19:00',
    local: {
      nome: '',
      logradouro: '',
      numero: 'S/N',
      bairro: '',
      cidadeNome: '',
      uf: '',
      cep: '',
      cidade: '',
    },
    status: 'pendente',
    totalConvidados: 0,
    convidadosConfirmados: 0,
    civil: false,
  };
}

function NovoCasamento() {
  const navigate = useNavigate();
  const { toast, success, hideToast } = useToast();
  const [formData, setFormData] = useState(buildInitialForm);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async () => {
    const { noiva, noivo, local: loc } = formData;
    if (!noiva.nome.trim() || !noivo.nome.trim() || !loc.nome.trim() || !loc.cep.trim()) {
      success('Preencha pelo menos nomes dos noivos, nome do local e CEP.');
      return;
    }

    setSaving(true);
    try {
      const created = await createWedding({
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
      success('Casamento cadastrado!');
      navigate(`/casamento/${created.id}`);
    } catch (err) {
      success(err.message);
    } finally {
      setSaving(false);
    }
  };

  const { noiva, noivo, data: dataEvento, horarioCerimonia, horarioRecepcao, local } = formData;

  return (
    <div className="casal-page animate-fade-in">
      <header className="casal-page__header">
        <div>
          <h1>Novo casamento</h1>
          <p className="casal-page__subtitle">Cadastre noivos, data e local do evento</p>
        </div>
        <div className="casal-page__actions">
          <Tooltip content="Voltar à lista">
            <Button variant="ghost" size="small" onClick={() => navigate('/')}>
              ← Voltar
            </Button>
          </Tooltip>
          <Tooltip content="Salvar e abrir o dashboard">
            <Button variant="success" size="small" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Salvando...' : '✓ Cadastrar'}
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="casal-page__grid">
        <Card title="Noiva" icon="👰" variant="primary">
          <div className="person-info">
            <div className="person-info__field">
              <label>Nome Completo</label>
              <input type="text" value={noiva.nome} onChange={(e) => updateSection('noiva', 'nome', e.target.value)} />
            </div>
            <div className="person-info__field">
              <label>Celular</label>
              <input type="tel" value={noiva.celular} onChange={(e) => updateSection('noiva', 'celular', e.target.value)} />
            </div>
            <div className="person-info__field">
              <label>E-mail</label>
              <input type="email" value={noiva.email} onChange={(e) => updateSection('noiva', 'email', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Noivo" icon="🤵" variant="secondary">
          <div className="person-info">
            <div className="person-info__field">
              <label>Nome Completo</label>
              <input type="text" value={noivo.nome} onChange={(e) => updateSection('noivo', 'nome', e.target.value)} />
            </div>
            <div className="person-info__field">
              <label>Celular</label>
              <input type="tel" value={noivo.celular} onChange={(e) => updateSection('noivo', 'celular', e.target.value)} />
            </div>
            <div className="person-info__field">
              <label>E-mail</label>
              <input type="email" value={noivo.email} onChange={(e) => updateSection('noivo', 'email', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Evento" icon="📅" className="casal-page__event-card">
          <div className="event-info">
            <div className="event-info__row">
              <div className="event-info__field">
                <label>Data do Casamento</label>
                <input type="date" value={dataEvento} onChange={(e) => updateRoot('data', e.target.value)} />
              </div>
            </div>
            <div className="event-info__row event-info__row--times">
              <div className="event-info__field">
                <label>Horário Cerimônia</label>
                <input type="time" value={horarioCerimonia} onChange={(e) => updateRoot('horarioCerimonia', e.target.value)} />
              </div>
              <div className="event-info__field">
                <label>Horário Recepção</label>
                <input type="time" value={horarioRecepcao} onChange={(e) => updateRoot('horarioRecepcao', e.target.value)} />
              </div>
            </div>
            <div className="event-info__field" style={{ marginTop: '0.75rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.civil}
                  onChange={(e) => updateRoot('civil', e.target.checked)}
                />{' '}
                Casamento civil
              </label>
            </div>
          </div>
        </Card>

        <Card title="Local" icon="📍" className="casal-page__location-card">
          <div className="location-info">
            <div className="location-info__field">
              <label>Nome do Espaço</label>
              <input type="text" value={local.nome} onChange={(e) => updateSection('local', 'nome', e.target.value)} />
            </div>
            <div className="location-info__field">
              <label>CEP</label>
              <input type="text" value={local.cep} onChange={(e) => updateSection('local', 'cep', e.target.value)} onBlur={handleCepBlur} />
            </div>
            <div className="location-info__field">
              <label>Logradouro</label>
              <input type="text" value={local.logradouro || ''} onChange={(e) => updateSection('local', 'logradouro', e.target.value)} />
            </div>
            <div className="location-info__row">
              <div className="location-info__field">
                <label>Número</label>
                <input type="text" value={local.numero || ''} onChange={(e) => updateSection('local', 'numero', e.target.value)} />
              </div>
              <div className="location-info__field">
                <label>Bairro</label>
                <input type="text" value={local.bairro || ''} onChange={(e) => updateSection('local', 'bairro', e.target.value)} />
              </div>
            </div>
            <div className="location-info__row">
              <div className="location-info__field">
                <label>Cidade</label>
                <input type="text" value={local.cidadeNome || ''} onChange={(e) => updateSection('local', 'cidadeNome', e.target.value)} />
              </div>
              <div className="location-info__field">
                <label>UF</label>
                <input type="text" value={local.uf || ''} onChange={(e) => updateSection('local', 'uf', e.target.value.toUpperCase())} maxLength={2} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

export default NovoCasamento;
