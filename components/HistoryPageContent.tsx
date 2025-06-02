import React, { useState, useEffect } from 'react';
import type { StudySession } from '../types';
import { getStudyHistory, clearStudyHistory as clearHistoryFromStorage } from '../services/localStorageService';
import Button from './ui/Button';
import Card from './ui/Card';
import { UI_TEXTS } from '../constants';

interface HistoryPageContentProps {
  onLoadSession: (sessionId: string) => void;
}

// Ícone SVG diretamente no componente
const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-500 dark:text-sky-400 mr-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);


const HistoryPageContent: React.FC<HistoryPageContentProps> = ({ onLoadSession }) => {
  const [history, setHistory] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHistory(getStudyHistory());
    setIsLoading(false);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o histórico de estudos? Esta ação não pode ser desfeita.")) {
      clearHistoryFromStorage();
      setHistory([]);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">{UI_TEXTS.loading}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <HistoryIcon />
          {UI_TEXTS.studyHistory}
        </h2>
        {history.length > 0 && (
          <Button onClick={handleClearHistory} variant="danger" size="sm" className="mt-4 sm:mt-0">
            <TrashIcon />
            Limpar Histórico
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="text-center p-8">
          <p className="text-xl text-gray-500 dark:text-gray-400">{UI_TEXTS.noHistory}</p>
          <p className="mt-2 text-gray-400 dark:text-gray-500">Comece uma nova sessão de estudos para ver seu progresso aqui.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map(session => (
            <Card key={session.id} className="hover:shadow-xl transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold text-sky-600 dark:text-sky-400">{session.pdfName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estudado em: {new Date(session.date).toLocaleDateString('pt-BR')} às {new Date(session.date).toLocaleTimeString('pt-BR')}
                  </p>
                  {session.score && (typeof session.score.correct === 'number' && typeof session.score.answered === 'number') && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Pontuação do Quiz: {session.score.correct} / {session.score.answered}
                    </p>
                  )}
                  {/* Bloco do simuladoScore removido */}
                </div>
                <Button onClick={() => onLoadSession(session.id)} variant="secondary" className="mt-4 sm:mt-0">
                  {UI_TEXTS.loadSession}
                </Button>
              </div>
              {session.summary && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate-3-lines">
                    <strong>Resumo:</strong> {session.summary.substring(0, 150)}...
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper CSS for truncation (Tailwind doesn't have multi-line truncate by default)
// Garante que o estilo seja adicionado apenas uma vez
if (!document.getElementById('truncate-style')) {
    const style = document.createElement('style');
    style.id = 'truncate-style';
    style.innerHTML = `
    .truncate-3-lines {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }
    `;
    document.head.appendChild(style);
}

export default HistoryPageContent;