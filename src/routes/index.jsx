import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components';
import {
    Casal,
    Cerimonia,
    ConvidadoDetalhe,
    Dashboard,
    Exportar,
    ExportarPlanejamento,
    Home,
    NotFound,
    NovoCasamento,
    Recepcao,
    Relatorios,
    ContadorConvidados
} from '../pages';

/**
 * Configuração das rotas da aplicação
 * Utiliza createBrowserRouter do React Router v6
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        // Página inicial - Lista de casamentos
        index: true,
        element: <Home />,
      },
      {
        path: 'casamento/novo',
        element: <NovoCasamento />,
      },
      {
        // Dashboard do casamento (rota dinâmica com :id)
        path: 'casamento/:id',
        element: <Dashboard />,
      },
      {
        // Dados do casal (rota aninhada)
        path: 'casamento/:id/casal',
        element: <Casal />,
      },
      {
        // Exportar planejamento completo
        path: 'casamento/:id/exportar',
        element: <ExportarPlanejamento />,
      },
      {
        // Cerimônia
        path: 'casamento/:id/cerimonia',
        element: <Cerimonia />,
      },
      {
        // Exportar documento da cerimônia
        path: 'casamento/:id/cerimonia/exportar',
        element: <Exportar />,
      },
      {
        // Recepção
        path: 'casamento/:id/recepcao',
        element: <Recepcao />,
      },
      {
        // Relatórios
        path: 'casamento/:id/relatorios',
        element: <Relatorios />,
      },
      {
        // Contador de convidados (nova rota)
        path: 'casamento/:id/contador',
        element: <ContadorConvidados />,
      },
      {
        // Detalhes do convidado (rota dinâmica com :id)
        path: 'casamento/:casamentoId/convidado/:id',
        element: <ConvidadoDetalhe />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
