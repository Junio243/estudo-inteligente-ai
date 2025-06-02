// types.ts

export interface UploadedPdf {
  name: string;
  extractedText: string;
}

export interface StudyTopic {
  id: string;
  title: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface MCQOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
}

export interface VideoSuggestion {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  youtubeUrl: string;
}

export interface StudySession {
  id: string; // timestamp or UUID
  pdfName: string;
  date: string; // ISO string
  extractedText?: string; // Texto extraído do PDF
  summary?: string;
  topics?: StudyTopic[];
  glossary?: GlossaryEntry[];
  questions?: Question[]; // Para o quiz interativo
  userAnswers?: { [questionId: string]: string }; // Respostas do quiz interativo
  score?: { // Pontuação do quiz interativo
    answered: number;
    correct: number;
  };
  videoSuggestions?: VideoSuggestion[]; // Pode ser gerado dinamicamente ou salvo
}

// Para as respostas da API Gemini
export interface GeminiSummaryResponse {
  summary: string;
}

export interface GeminiTopicsResponse {
  topics: string[];
}

export interface GeminiGlossaryResponseItem {
  term: string;
  definition: string;
}

export interface GeminiMCQResponseItem {
  questionText: string;
  options: Array<{ id: string, text: string }>;
  correctOptionId: string;
  explanation: string;
}