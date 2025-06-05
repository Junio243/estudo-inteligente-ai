/**
 * Limpa e parseia uma string JSON, removendo possíveis cercas de markdown.
 * @param jsonString A string JSON, possivelmente com cercas de markdown.
 * @returns O objeto JSON parseado.
 * @throws Error se o parse falhar.
 */
export const parseJsonSafely = <T,>(jsonString: string): T => {
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
