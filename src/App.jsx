import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './styles/global.css';

/**
 * Componente principal da aplicação
 * Configura o router e estilos globais
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
