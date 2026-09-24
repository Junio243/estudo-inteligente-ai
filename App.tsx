
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePageContent from './components/HomePageContent';
import HistoryPageContent from './components/HistoryPageContent';
import PageShell from './components/PageShell';
import type { StudySession, UploadedPdf } from './types';
import { saveStudySession as saveSessionToStorage, getStudyHistory as getHistoryFromStorage } from './services/localStorageService';

const UploadPageContent = lazy(() => import('./components/UploadPageContent'));
const StudyPageContent = lazy(() => import('./components/StudyPageContent'));

const App: React.FC = () => {
  const [currentStudySession, setCurrentStudySession] = useState<StudySession | null>(null);
  const navigate = useNavigate();

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
    const saved = saveSessionToStorage(session);
    setCurrentStudySession(session); // Atualiza o estado global da sessão
    return saved;
    // alert('Sessão de estudo salva com sucesso!');
    // navigate('/history'); // Opcional: navegar para o histórico após salvar
  }, []);
  
  const handleLoadStudySession = useCallback((sessionId: string) => {
    const history = getHistoryFromStorage();
    const sessionToLoad = history.find(s => s.id === sessionId);
    if (sessionToLoad) {
      setCurrentStudySession(sessionToLoad);
      navigate('/study', { replace: true });
    } else {
      alert('Sessão de estudo não encontrada.');
      navigate('/history');
    }
  }, [navigate]);


  return (
    <PageShell>
      <Suspense fallback={<p role="status" className="p-8 text-center">Carregando página…</p>}>
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
      </Suspense>
    </PageShell>
  );
};

export default App;
