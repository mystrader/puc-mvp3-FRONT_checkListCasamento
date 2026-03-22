const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Não foi possível concluir a requisição.';
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // Mantém a mensagem padrão quando a API não retorna JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export function fetchWeddings() {
  return request('/casamentos');
}

export function fetchWeddingOverview(weddingId) {
  return request(`/casamentos/${weddingId}/visao-geral`);
}

export function updateWedding(weddingId, payload) {
  return request(`/casamentos/${weddingId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function fetchChecklist(weddingId) {
  return request(`/checklists/casamentos/${weddingId}`);
}

export function updateChecklistItem(weddingId, itemId, payload) {
  return request(`/checklists/casamentos/${weddingId}/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchCeremonyData(weddingId) {
  const [checklistItems, musicas] = await Promise.all([
    fetchChecklist(weddingId),
    request(`/casamentos/${weddingId}/musicas`),
  ]);

  return { checklistItems, musicas };
}

export function fetchGuests(weddingId) {
  return request(`/casamentos/${weddingId}/convidados`);
}

export function fetchReception(weddingId) {
  return request(`/casamentos/${weddingId}/recepcao`);
}

export function fetchCounter(weddingId) {
  return request(`/casamentos/${weddingId}/contador`);
}

export function updateCounter(weddingId, payload) {
  return request(`/casamentos/${weddingId}/contador`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchAddressByCep(rawCep) {
  const cep = rawCep.replace(/\D/g, '');
  if (cep.length !== 8) {
    throw new Error('Informe um CEP com 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error('Falha ao consultar o ViaCEP.');
  }

  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado no ViaCEP.');
  }

  return data;
}
