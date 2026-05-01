

# Frontend React - Checklist Casamento

Interface React do MVP da PUC-Rio para gestão de casamentos. Este módulo consome a API Flask própria, substitui a antiga persistência em `localStorage` por chamadas HTTP e integra a API ViaCEP no formulário de endereço do casal.

<img width="1030" height="536" alt="frontend" src="https://github.com/user-attachments/assets/8d47dbb6-cd5b-4657-8a50-543f7256a925" />


## Tecnologias

- React 19
- Vite
- React Router
- Fetch API
- Docker

## Como executar com Docker

```bash
cd puc-mvp3-FRONT_checkListCasamento
docker build -t checklist-casamento-frontend .
docker run --rm -p 5173:80 checklist-casamento-frontend
```

A interface ficará disponível em [http://localhost:5173](http://localhost:5173).

Em desenvolvimento (`npm run dev`), as chamadas vão para o mesmo host do Vite e são encaminhadas a `http://127.0.0.1:5001` (use `VITE_PROXY_TARGET` se a API estiver em outra URL). Evite definir `VITE_API_BASE_URL` só para dev — isso faria o browser chamar a API direto e exigiria CORS. No build de produção, use `VITE_API_BASE_URL` ou o fallback `http://localhost:5001`.

**Service Worker:** em `npm run dev` o SW **não é registrado** (e registros antigos são removidos), para evitar cache que obrigue F5 após mudanças. Em build de produção o `sw.js` usa **rede primeiro** (HTML/JS sempre atualizados; API nunca vem de cache). Para desativar o SW mesmo em produção, defina no `.env`: `VITE_DISABLE_SW=true`.

## Fluxograma da arquitetura

O desenho vetorial está em [`public/arquitetura-frontend.svg`](public/arquitetura-frontend.svg). Na **pré-visualização do Cursor/VS Code**, arquivos **SVG locais** costumam **não aparecer** no README (bloqueio de segurança); no **GitHub** o SVG e o diagrama abaixo renderizam normalmente.

```mermaid
flowchart LR
  subgraph react [Interface React]
    R[Vite + Router + Pages]
  end
  subgraph flask [API própria]
    F[Flask REST + SQLite]
  end
  subgraph data [Persistência]
    P[Casamentos e checklist]
  end
  V[API ViaCEP]
  R -->|fetch| F
  F -->|CRUD| P
  R -->|consulta CEP HTTPS| V
```

![Fluxograma SVG — React, API Flask e ViaCEP](public/arquitetura-frontend.svg)

A API própria e o Swagger usam a porta **5001** por padrão: **[http://localhost:5001/swagger](http://localhost:5001/swagger)**. O ViaCEP é chamado **direto do navegador** (não passa pelo Flask).

## Funcionalidades implementadas

- Listagem de casamentos carregada pela API Flask
- Edição dos dados do casal com `PUT /casamentos/:id`
- Checklist da cerimônia com atualização remota por item
- Contador de convidados persistido no backend
- Busca de endereço por CEP com consumo real da API ViaCEP

## Estrutura

- `src/hooks/useWeddingData.js`: hook central para consumo da API
- `src/services/api.js`: cliente HTTP da aplicação
- `src/pages/Casal`: formulário com integração ViaCEP
- `src/pages/Cerimonia`: checklist persistido na API

## Observação

Na entrega final da disciplina, o frontend deve ser publicado em um repositório público separado do backend.
