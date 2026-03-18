import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchCeremonyData,
  fetchGuests,
  fetchReception,
  fetchWeddingOverview,
  fetchWeddings,
} from '../services/api';

function useWeddingData(dataKey = null) {
  const { id, casamentoId } = useParams();
  const weddingId = id || casamentoId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (dataKey === 'casamentos') {
          response = await fetchWeddings();
        } else if (!weddingId) {
          throw new Error('Nenhum casamento foi selecionado.');
        } else if (dataKey === 'cerimonia') {
          response = await fetchCeremonyData(weddingId);
        } else if (dataKey === 'convidados') {
          response = await fetchGuests(weddingId);
        } else if (dataKey === 'recepcao') {
          response = await fetchReception(weddingId);
        } else {
          response = await fetchWeddingOverview(weddingId);
        }

        if (!ignore) {
          setData(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [dataKey, reloadKey, weddingId]);

  const refetch = () => {
    setReloadKey((current) => current + 1);
  };

  return { data, loading, error, refetch };
}

export default useWeddingData;
