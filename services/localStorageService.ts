
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

export function saveStudySession(session: StudySession): boolean {
  try {
    const history = getStudyHistory();
    // Remove sessão antiga se existir com mesmo ID, para atualizar
    const updatedHistory = history.filter(s => s.id !== session.id);
    updatedHistory.unshift(session); // Adiciona a nova/atualizada no início
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Erro ao salvar sessão no localStorage:", error);
    return false;
  }
}

export function clearStudyHistory(): boolean {
  try {
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Erro ao limpar histórico do localStorage:", error);
    return false;
  }
}
