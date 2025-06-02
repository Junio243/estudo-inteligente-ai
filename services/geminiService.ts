// services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GlossaryEntry, Question, VideoSuggestion, GeminiMCQResponseItem, GeminiGlossaryResponseItem } from '../types';
import { GEMINI_TEXT_MODEL, MAX_TOPICS } from '../constants'; // NUM_MCQS e NUM_SIMULADO_MCQS removidos

// @ts-ignore Certifique-se que process.env.API_KEY está disponível
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey || apiKey === "COLE_AQUI_SUA_CHAVE_API_GEMINI_REAL") { // Modificado para corresponder ao App.tsx
  console.error("Chave da API do Gemini não configurada ou é um placeholder. As chamadas para a API falharão. Verifique App.tsx ou suas variáveis de ambiente.");
}
const ai = new GoogleGenAI({ apiKey: apiKey! });

/**
 * Limpa e parseia uma string JSON, removendo possíveis cercas de markdown.
 * @param jsonString A string JSON, possivelmente com cercas de markdown.
 * @returns O objeto JSON parseado.
 * @throws Error se o parse falhar.
 */
const parseJsonSafely = <T,>(jsonString: string): T => {
  let cleanJsonString = jsonString.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanJsonString.match(fenceRegex);
  if (match && match[1]) {
    cleanJsonString = match[1].trim();
  }
  try {
    return JSON.parse(cleanJsonString) as T;
  } catch (e) {
    console.error("Falha ao parsear JSON:", e, "String original:", jsonString, "String limpa:", cleanJsonString);
    throw new Error(`Formato de JSON inválido recebido da IA. Detalhes: ${(e as Error).message}`);
  }
};


export async function generateSummary(text: string): Promise<string> {
  const model = GEMINI_TEXT_MODEL;
  const prompt = `Você é um assistente de IA especializado em educação. Resuma o seguinte texto acadêmico de forma clara e concisa, destacando os principais conceitos em português do Brasil. O resumo deve ser adequado para um estudante que está revisando a matéria. Limite o resumo a cerca de 200-300 palavras. Texto:\n\n"${text}"`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    throw new Error(`Falha ao gerar resumo: ${(error as Error).message}`);
  }
}

export async function generateTopics(text: string): Promise<string[]> {
  const model = GEMINI_TEXT_MODEL;
  const prompt = `Você é um assistente de IA especializado em educação. Analise o seguinte texto e identifique até ${MAX_TOPICS} tópicos principais abordados. Liste os tópicos em português do Brasil, cada um em uma nova linha, sem numeração ou marcadores. Texto:\n\n"${text}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim().split('\n').filter(topic => topic.trim() !== '');
  } catch (error) {
    console.error("Erro ao gerar tópicos:", error);
    throw new Error(`Falha ao gerar tópicos: ${(error as Error).message}`);
  }
}

export async function generateGlossary(text: string): Promise<GlossaryEntry[]> {
  const model = GEMINI_TEXT_MODEL;
  const prompt = `Você é um assistente de IA especializado em educação. Analise o seguinte texto e crie um glossário com 5-7 termos-chave e suas definições concisas. 
  Formate a resposta EXCLUSIVAMENTE como um array de objetos JSON, onde cada objeto tem as chaves 'term' e 'definition'. O array deve começar com '[' e terminar com ']'.
  Forneça as definições em português do Brasil. Somente o array JSON deve ser retornado, sem nenhum texto ou formatação markdown adicional.
  Texto:\n\n"${text}"
  Exemplo de formato de saída:
  \`\`\`json
  [
    {"term": "Termo Exemplo 1", "definition": "Definição concisa do Termo Exemplo 1."},
    {"term": "Termo Exemplo 2", "definition": "Definição concisa do Termo Exemplo 2."}
  ]
  \`\`\``;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const parsedData = parseJsonSafely<GeminiGlossaryResponseItem[]>(response.text);
    return parsedData;
  } catch (error) {
    console.error("Erro ao gerar glossário:", error);
    throw new Error(`Falha ao gerar glossário: ${(error as Error).message}`);
  }
}

export async function generateMCQs(text: string): Promise<Question[]> { // count parameter removed
  const model = GEMINI_TEXT_MODEL;
  const prompt = `Você é um assistente de IA altamente qualificado, especializado na criação de material educacional em português do Brasil.
Sua tarefa é gerar o MÁXIMO POSSÍVEL de questões de múltipla escolha (MCQs) distintas, relevantes e de alta qualidade, com base no seguinte texto.
As questões devem cobrir uma variedade de conceitos importantes e testar diferentes níveis de compreensão do texto. Gere pelo menos 5 questões, se possível, mas não se limite a este número se o texto permitir mais.
Formato da Resposta:
- A resposta DEVE ser EXCLUSIVAMENTE um array de objetos JSON.
- O array deve começar com '[' e terminar com ']'.
- Cada objeto no array representa uma questão e DEVE conter as seguintes chaves:
  - "questionText": (string) O enunciado da questão.
  - "options": (array de objetos) Exatamente 4 opções de resposta. Cada objeto de opção deve ter:
    - "id": (string) Identificador da opção ('A', 'B', 'C', ou 'D').
    - "text": (string) O texto da opção.
  - "correctOptionId": (string) O 'id' da opção correta (ex: "B").
  - "explanation": (string) Uma explicação concisa do porquê a opção correta é a certa, baseada no texto.
- IMPORTANTE: Todos os arrays JSON (o array principal de questões e cada array 'options') DEVEM ser delimitados por colchetes \`[]\`. Não use parênteses \`()\` para arrays.
- NÃO inclua nenhum texto, comentários ou formatação markdown fora da estrutura do array JSON. A resposta deve ser apenas o JSON.
Se o texto for muito curto ou inadequado para gerar um número significativo de questões, gere quantas forem possíveis mantendo a qualidade. Não retorne um array vazio a menos que seja absolutamente impossível.

Texto para análise:
"""
${text}
"""

Exemplo de formato para UMA questão dentro do array:
{
  "questionText": "Qual é a principal função da mitocôndria?",
  "options": [
    {"id": "A", "text": "Síntese de proteínas"},
    {"id": "B", "text": "Respiração celular e produção de ATP"},
    {"id": "C", "text": "Digestão celular"},
    {"id": "D", "text": "Armazenamento de material genético"}
  ],
  "correctOptionId": "B",
  "explanation": "As mitocôndrias são conhecidas como as 'usinas de energia' da célula, responsáveis pela respiração celular e a maior parte da produção de ATP."
}
Lembre-se, a saída final deve ser um array JSON contendo as questões.`;

  try {
    console.log("[geminiService] Gerando MCQs (máximo possível)...");
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    console.log("[geminiService] Resposta BRUTA da API (MCQs):\n", response.text);

    const parsedData = parseJsonSafely<GeminiMCQResponseItem[]>(response.text);
    console.log("[geminiService] Dados parseados (MCQs):", parsedData);
    
    if (!Array.isArray(parsedData)) { // Não checar parsedData.length === 0 aqui, pode ser válido
        console.warn(`[geminiService] A API não retornou um array de questões válido. Resposta original: ${response.text}`);
        throw new Error("A API não retornou questões válidas para o questionário.");
    }
    if (parsedData.length === 0) {
        console.warn(`[geminiService] A API retornou um array VAZIO de questões para o quiz. O texto pode ser muito curto ou inadequado.`);
    }


    return parsedData.map((item, index) => ({
      id: `mcq-${Date.now()}-${index}`, // Gera um ID único
      ...item
    }));
  } catch (error) {
    console.error("Erro ao gerar MCQs:", error);
    throw new Error(`Falha ao gerar MCQs: ${(error as Error).message}`);
  }
}

// generateSimuladoMCQs REMOVIDA

// Simulação para sugestões de vídeo, já que a API do YouTube requer configuração complexa
export async function generateVideoSuggestions(query: string): Promise<VideoSuggestion[]> {
  console.log(`Simulando busca no YouTube por: "${query}"`);
  // Simula uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  // Remove aspas da query para melhor resultado em placeholders
  const cleanQuery = query.replace(/"/g, '');

  const mockVideos: VideoSuggestion[] = [
    { 
      id: 'video1', 
      title: `Videoaula Completa sobre ${cleanQuery}`, 
      thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery)}1/320/180`, 
      duration: "45:20", 
      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent("videoaula " + cleanQuery)}` 
    },
    { 
      id: 'video2', 
      title: `Resumo Rápido de ${cleanQuery} em 10 Minutos`, 
      thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery)}2/320/180`, 
      duration: "10:05", 
      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent("resumo " + cleanQuery)}`
    },
    { 
      id: 'video3', 
      title: `Exercícios Resolvidos de ${cleanQuery}`, 
      thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(cleanQuery)}3/320/180`, 
      duration: "25:00", 
      youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent("exercícios resolvidos " + cleanQuery)}`
    },
  ];
  return mockVideos;
}
