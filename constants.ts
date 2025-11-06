// constants.ts

export const APP_NAME = "Estudo Inteligente AI";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-lite"; // Modelo para texto
// Não estamos usando geração de imagem nesta app.

export const MAX_TOPICS = 7; // Máximo de tópicos a serem gerados
// NUM_MCQS removido - o quiz principal agora tentará gerar o máximo de questões dinamicamente.
// NUM_SIMULADO_MCQS removido

export const LOCAL_STORAGE_HISTORY_KEY = "estudoInteligenteHistory";

// Mensagens motivacionais
export const MOTIVATIONAL_MESSAGES = [
  "Acredite em você e em tudo que você é. Saiba que existe algo dentro de você que é maior que qualquer obstáculo.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Não espere por oportunidades extraordinárias. Agarre as ocasiões comuns e as torne grandes.",
  "Sua dedicação de hoje é o seu sucesso de amanhã.",
  "Estudar é acender uma luz na escuridão do desconhecido."
];

// Textos da UI
export const UI_TEXTS = {
  startStudying: "Começar a Estudar",
  uploadPdf: "Enviar PDF",
  processingPdf: "Processando PDF...",
  selectPdf: "Selecione um arquivo PDF",
  pdfPreview: "Prévia do PDF",
  generateSummary: "Gerar Resumo",
  summary: "Resumo Gerado",
  topics: "Tópicos Principais",
  glossary: "Glossário de Termos-Chave",
  quiz: "Questionário Interativo",
  videoSuggestions: "Sugestões de Videoaulas",
  answerQuestion: "Responder",
  nextQuestion: "Próxima Pergunta",
  showResults: "Ver Resultados",
  correctAnswer: "Resposta Correta!",
  wrongAnswer: "Resposta Incorreta.",
  yourAnswer: "Sua resposta:",
  correctIs: "A resposta correta é:",
  explanation: "Explicação:",
  watchVideo: "Assistir Vídeo",
  studyHistory: "Histórico de Estudos",
  noHistory: "Nenhum histórico de estudo encontrado.",
  loadSession: "Revisar Sessão",
  saveSession: "Salvar Sessão",
  backToHome: "Voltar ao Início",
  errorOccurred: "Ocorreu um erro",
  tryAgain: "Tentar Novamente",
  loading: "Carregando...",
  pdfUploadError: "Por favor, selecione um arquivo PDF válido.",
  geminiError: "Erro ao comunicar com a IA. Verifique sua chave de API e conexão.",
  noContentGenerated: "Não foi possível gerar o conteúdo solicitado.",
  apiKeyWarning: "Atenção: A chave da API do Gemini não parece estar configurada corretamente. Algumas funcionalidades podem não operar como esperado. Verifique a console para mais detalhes e configure a variável de ambiente `API_KEY`.",
  // Textos para Simulado de Prova REMOVIDOS
};
