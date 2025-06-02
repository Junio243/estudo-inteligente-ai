
import type { StudySession } from '../types';
import { LOCAL_STORAGE_HISTORY_KEY } from '../constants';

export function getStudyHistory(): StudySession[] {
  try {
    const historyJson = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson) as StudySession[];
      // Ordena do mais recente para o mais antigo
      return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error("Erro ao carregar histórico do localStorage:", error);
  }
  return [];
}

export function saveStudySession(session: StudySession): void {
  try {
    const history = getStudyHistory();
    // Remove sessão antiga se existir com mesmo ID, para atualizar
    const updatedHistory = history.filter(s => s.id !== session.id);
    updatedHistory.unshift(session); // Adiciona a nova/atualizada no início
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Erro ao salvar sessão no localStorage:", error);
  }
}

export function clearStudyHistory(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  } catch (error) {
    console.error("Erro ao limpar histórico do localStorage:", error);
  }
}
