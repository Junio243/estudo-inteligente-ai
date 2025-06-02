# Estudo Inteligente AI 🧠💡

Bem-vindo ao Estudo Inteligente AI! Esta é uma plataforma educacional personalizada projetada para ajudar estudantes a otimizar seus estudos utilizando Inteligência Artificial. Com ela, você pode transformar seus materiais de aula em PDFs em resumos concisos, gerar quizzes interativos para testar seu conhecimento e encontrar sugestões de videoaulas relevantes no YouTube.

## Funcionalidades Principais

-   **Upload de PDFs:** Envie seus arquivos PDF contendo o material de aula.
-   **Resumos Inteligentes:** A IA gera automaticamente resumos dos principais conceitos do seu material.
-   **Questionário Interativo Dinâmico:** Crie questionários de múltipla escolha (MCQs) com gabarito e explicações baseados no conteúdo do PDF. A IA tentará gerar o máximo de questões relevantes possível para cobrir o material.
-   **Sugestões de Videoaulas:** Receba recomendações de vídeos do YouTube relacionados aos temas do seu estudo.
-   **Design Moderno e Responsivo:** Interface intuitiva com modo escuro automático, adaptável para desktops e celulares.
-   **Histórico de Estudos:** Suas sessões de estudo são salvas localmente no navegador para fácil acesso e revisão.

## 🛠️ Configuração e Execução

Este projeto é uma aplicação React single-page (SPA) construída com TypeScript e estilizada com Tailwind CSS.

### Pré-requisitos

-   Navegador moderno com suporte a JavaScript.
-   Node.js e npm/yarn (se você for modificar ou construir o projeto a partir dos fontes em um ambiente de desenvolvimento React padrão).

### Variável de Ambiente Essencial: Chave da API Gemini

Para que as funcionalidades de Inteligência Artificial (resumos, quizzes, etc.) funcionem, você **PRECISA** de uma chave da API do Google Gemini.

1.  **Obtenha sua Chave da API:**
    *   Visite o [Google AI Studio](https://aistudio.google.com/app/apikey) para criar e obter sua chave da API.

2.  **Configure a Variável de Ambiente:**
    *   A aplicação espera que a chave da API esteja disponível como uma variável de ambiente chamada `API_KEY`.
    *   **Desenvolvimento Local (exemplo com `.env` file, se usar um bundler como Vite ou Create React App):**
        Crie um arquivo `.env` na raiz do seu projeto (se não existir) e adicione sua chave:
        ```
        # Para Vite:
        VITE_API_KEY=SUA_CHAVE_API_AQUI

        # Para Create React App:
        REACT_APP_API_KEY=SUA_CHAVE_API_AQUI
        ```
        O código fornecido tenta usar `process.env.API_KEY`. Se você estiver executando os arquivos diretamente ou em um ambiente que não define `process.env` através de um sistema de build, você pode precisar ajustar como a chave é fornecida ao `geminiService.ts` ou definir `process.env.API_KEY` globalmente no seu ambiente de execução.
        **Para este conjunto de arquivos, o `App.tsx` inclui um fallback que permite definir a chave diretamente no código (NÃO RECOMENDADO PARA PRODUÇÃO):**
        ```typescript
        // Em App.tsx (aproximadamente linha 20)
        // const PLACEHOLDER_API_KEY = "COLE_AQUI_SUA_CHAVE_API_GEMINI_REAL";
        // if (!process.env.API_KEY || process.env.API_KEY === PLACEHOLDER_API_KEY) {
        //   process.env.API_KEY = PLACEHOLDER_API_KEY; 
        //   console.warn(...);
        // }
        ```
        **É fortemente recomendado configurar a chave da API através de variáveis de ambiente reais para segurança e boas práticas.**

### Executando a Aplicação

Os arquivos fornecidos (`.tsx`, `.html`, `metadata.json`) são projetados para serem integrados em um ambiente de desenvolvimento React.

1.  **Estrutura de Arquivos:**
    Coloque todos os arquivos fornecidos na estrutura de diretórios correta, como especificado implicitamente pelos caminhos de importação (geralmente dentro de uma pasta `src/`).

2.  **Instalar Dependências (exemplo):**
    Se você estiver configurando um novo projeto React:
    ```bash
    npm install react react-dom react-router-dom @google/genai
    npm install -D typescript @types/react @types/react-dom tailwindcss
    # ...outras dependências de build
    ```

3.  **Servidor de Desenvolvimento:**
    Use um servidor de desenvolvimento como o do Vite ou Create React App:
    ```bash
    npm run dev  # ou yarn dev (para Vite)
    npm start    # ou yarn start (para Create React App)
    ```
    Isso geralmente abrirá a aplicação no seu navegador em um endereço como `http://localhost:3000` ou `http://localhost:5173`.

    Se você não estiver usando um sistema de build, pode tentar servir o `index.html` diretamente através de um servidor web simples, mas certifique-se de que as importações de módulos TypeScript (`.tsx`) sejam tratadas corretamente (geralmente requer um passo de compilação/transpilação).

## Estrutura do Projeto (Simplificada)

```
/
├── public/
│   └── (ícones, etc. - não fornecido, usa CDN e SVG inline)
├── src/
│   ├── components/
│   │   ├── ui/ (Button.tsx, Card.tsx, LoadingSpinner.tsx)
│   │   ├── HomePageContent.tsx
│   │   ├── UploadPageContent.tsx
│   │   ├── StudyPageContent.tsx
│   │   ├── HistoryPageContent.tsx
│   │   └── PageShell.tsx
│   ├── services/
│   │   ├── geminiService.ts
│   │   └── localStorageService.ts
│   ├── App.tsx
│   ├── constants.ts
│   ├── index.html (geralmente na raiz ou `public`)
│   ├── index.tsx
│   ├── metadata.json (geralmente na raiz ou `public`)
│   ├── types.ts
│   └── README.md (este arquivo)
├── tailwind.config.js (se customizar Tailwind)
└── package.json
```
*Nota: A estrutura exata pode variar dependendo do seu setup de build React.*

## Tecnologias Utilizadas

-   **React 18+** (com Hooks e Componentes Funcionais)
-   **TypeScript**
-   **Tailwind CSS** (para estilização e design responsivo)
-   **Google Gemini API** (para funcionalidades de IA)
-   **React Router DOM** (para navegação, usando `HashRouter`)
-   **LocalStorage API** (para persistência de dados no navegador)

## Contribuições

Este projeto é um exemplo. Sinta-se à vontade para expandir, modificar e adaptar às suas necessidades!

---

Feito com 🧠 e ❤️ por IA para estudantes brasileiros!