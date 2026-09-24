# Estudo Inteligente AI

Transforme o texto de PDFs em material de revisão em português: resumos, tópicos, glossário e questionários com explicações.

[![CI](https://github.com/Junio243/estudo-inteligente-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Junio243/estudo-inteligente-ai/actions/workflows/ci.yml)

**[Abrir demonstração](https://estudo-inteligente-ai.onrender.com)** · **[Reportar um problema](https://github.com/Junio243/estudo-inteligente-ai/issues)**

## Como funciona

1. Envie um PDF com texto selecionável.
2. O PDF.js extrai o texto no navegador.
3. O Gemini gera o material de estudo a partir desse texto.
4. Responda ao quiz e salve a sessão no histórico local.

O histórico fica neste navegador, sem sincronização entre dispositivos. Se o armazenamento estiver cheio ou bloqueado, a interface informa a falha e mantém a sessão aberta. Limpar os dados do navegador também remove o histórico.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS, PDF.js e Google Gemini. CSS e worker do PDF.js são empacotados no build; as páginas de upload e estudo carregam sob demanda.

## Executar localmente

Use Node.js 22 e npm.

~~~sh
git clone https://github.com/Junio243/estudo-inteligente-ai.git
cd estudo-inteligente-ai
npm ci
npm run dev
~~~

A navegação e o histórico podem abrir sem chave de IA. Para gerar conteúdo, crie um arquivo `.env.local`:

~~~env
VITE_GEMINI_API_KEY=sua_chave_de_desenvolvimento
~~~

Reinicie o servidor após alterar o ambiente. O modelo utilizado é definido em [constants.ts](constants.ts).

**Limite da arquitetura atual:** variáveis `VITE_*` entram no JavaScript entregue ao navegador. Não use uma chave confidencial em um deployment público desta versão; para isso, as chamadas devem passar por um backend com autenticação e controle de uso. O texto enviado ao Gemini sai do navegador; evite PDFs com dados sensíveis.

## Testes e build

~~~sh
npm test
npm run type-check
npm run build
npm run preview
~~~

O comando de testes funciona em Windows, Linux e macOS. Ele cobre parsing das respostas JSON, persistência do histórico, atualização de sessões e falhas de armazenamento. O CI usa instalação reproduzível com `npm ci`, checagem de tipos, testes e build.

O diretório publicado é `dist/`. As rotas usam hash (`/#/upload`, por exemplo), permitindo hospedagem estática.

## Limitações conhecidas

- PDFs digitalizados como imagem precisam de OCR externo; o projeto extrai texto já presente no arquivo.
- Conteúdo gerado por IA deve ser revisado; pode conter erros.
- A seção de vídeos oferece buscas no YouTube, não uma integração com seu catálogo.
- O histórico local não substitui um backup dos materiais importantes.

## Organização

- `components/`: páginas e elementos de interface.
- `services/`: integração com Gemini, parsing e armazenamento local.
- `types.ts`: contratos do material de estudo.
- `tests/` e `scripts/test.mjs`: regressões e execução multiplataforma.

Criado e mantido por [Alexandre Júnio Canuto Lopes](https://github.com/Junio243).
