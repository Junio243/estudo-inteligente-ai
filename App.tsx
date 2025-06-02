
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import HomePageContent from './components/HomePageContent';
import UploadPageContent from './components/UploadPageContent';
import StudyPageContent from './components/StudyPageContent';
import HistoryPageContent from './components/HistoryPageContent';
import PageShell from './components/PageShell';
import type { StudySession, UploadedPdf } from './types';
import { saveStudySession as saveSessionToStorage, getStudyHistory as getHistoryFromStorage } from './services/localStorageService';

// Definindo process.env.API_KEY para fins de demonstração, se não estiver definido globalmente.
// Em um ambiente real, isso seria configurado no processo de build ou servidor.
if (typeof process === 'undefined') {
  // @ts-ignore
  global.process = { env: {} };
}

const PLACEHOLDER_API_KEY = "COLE_AQUI_SUA_CHAVE_API_GEMINI_REAL"; // Placeholder mais óbvio

// @ts-ignore
if (!process.env.API_KEY || process.env.API_KEY === PLACEHOLDER_API_KEY) {
  // @ts-ignore
  process.env.API_KEY = PLACEHOLDER_API_KEY; 
  console.warn(`ATENÇÃO: Chave da API do Gemini não configurada ou usando valor placeholder ("${PLACEHOLDER_API_KEY}"). 
Por favor, configure a variável de ambiente API_KEY ou edite App.tsx (linha ~20) com sua chave real. 
Funcionalidades de IA podem não operar corretamente.`);
}


const App: React.FC = () => {
  const [currentPdf, setCurrentPdf] = useState<UploadedPdf | null>(null);
  const [currentStudySession, setCurrentStudySession] = useState<StudySession | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Gerencia a classe dark no HTML para o TailwindCSS
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    if (matcher.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    matcher.addEventListener('change', handleChange);
    return () => matcher.removeEventListener('change', handleChange);
  }, []);

  const handlePdfUploaded = useCallback((pdf: UploadedPdf) => {
    setCurrentPdf(pdf);
    // Cria uma nova sessão de estudo baseada no PDF
    const newSession: StudySession = {
      id: Date.now().toString(),
      pdfName: pdf.name,
      date: new Date().toISOString(),
      extractedText: pdf.extractedText,
      // Outros campos serão preenchidos na StudyPage
    };
    setCurrentStudySession(newSession);
    navigate('/study');
  }, [navigate]);

  const handleSaveStudySession = useCallback((session: StudySession) => {
    saveSessionToStorage(session);
    setCurrentStudySession(session); // Atualiza o estado global da sessão
    // alert('Sessão de estudo salva com sucesso!');
    // navigate('/history'); // Opcional: navegar para o histórico após salvar
  }, []);
  
  const handleLoadStudySession = useCallback((sessionId: string) => {
    const history = getHistoryFromStorage();
    const sessionToLoad = history.find(s => s.id === sessionId);
    if (sessionToLoad) {
      setCurrentPdf({ name: sessionToLoad.pdfName, extractedText: sessionToLoad.extractedText || "" });
      setCurrentStudySession(sessionToLoad);
      navigate('/study', { replace: true });
    } else {
      alert('Sessão de estudo não encontrada.');
      navigate('/history');
    }
  }, [navigate]);


  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomePageContent onStart={() => navigate('/upload')} />} />
        <Route path="/upload" element={<UploadPageContent onPdfProcessed={handlePdfUploaded} />} />
        <Route 
          path="/study" 
          element={
            currentStudySession ? (
              <StudyPageContent 
                session={currentStudySession} 
                onSaveSession={handleSaveStudySession} 
              />
            ) : (
              <div className="text-center p-8">
                <p>Nenhum PDF carregado ou sessão de estudo ativa.</p>
                <Link to="/upload" className="text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
                  Carregar um PDF para começar
                </Link>
              </div>
            )
          } 
        />
        <Route path="/history" element={<HistoryPageContent onLoadSession={handleLoadStudySession} />} />
      </Routes>
    </PageShell>
  );
};

export default App;