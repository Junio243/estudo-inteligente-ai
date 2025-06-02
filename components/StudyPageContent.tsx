// components/StudyPageContent.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { StudySession, Question, GlossaryEntry, StudyTopic, VideoSuggestion, MCQOption } from '../types';
import { generateSummary, generateTopics, generateGlossary, generateMCQs, generateVideoSuggestions } from '../services/geminiService'; // generateSimuladoMCQs removido
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import Card from './ui/Card';
import { UI_TEXTS } from '../constants'; // NUM_MCQS, NUM_SIMULADO_MCQS removidos

// Ícones como componentes locais
const SummaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0_12.75h5.625c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9H8.25M10.5 21L12 17.5m0 0l1.5 3.5M12 17.5H4.5m15 0H21" /></svg>;
const TopicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const GlossaryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const QuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7C14.318 4.546 13.1 4.5 12 4.5c-1.232 0-2.453.046-3.662.138a4.006 4.006 0 00-3.7 3.7C4.546 9.682 4.5 10.9 4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7c1.344.092 2.635.138 3.838.138s2.494-.046 3.838-.138a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>;
// SimuladoIcon removido


interface StudyPageContentProps {
  session: StudySession;
  onSaveSession: (session: StudySession) => void;
}

const StudyPageContent: React.FC<StudyPageContentProps> = ({ session: initialSession, onSaveSession }) => {
  const [currentSession, setCurrentSession] = useState<StudySession>(initialSession);
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingGlossary, setIsLoadingGlossary] = useState(false);
  const [isLoadingMCQs, setIsLoadingMCQs] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Estados do Simulado Removidos


  const { 
    extractedText, pdfName, summary, topics, glossary, questions, videoSuggestions, userAnswers, score,
    // Campos do simulado removidos da desestruturação
  } = currentSession;

  const loadInitialData = useCallback(async () => {
    if (!extractedText) {
      setError("Texto do PDF não encontrado para processamento.");
      return;
    }

    // Load normal quiz and other data if not present
    if (!summary) { /* ... */ }
    if (!topics || topics.length === 0) { /* ... */ }
    if (!glossary || glossary.length === 0) { /* ... */ }
    if (!questions || questions.length === 0) {
      setIsLoadingMCQs(true);
      try {
        // generateMCQs agora não recebe 'count'
        const genMCQs = await generateMCQs(extractedText);
        setCurrentSession(prev => ({ ...prev, questions: genMCQs, userAnswers: {}, score: { answered: 0, correct: 0 } }));
      } catch (e) { setError(UI_TEXTS.geminiError + (e instanceof Error ? `: ${e.message}`: '')); }
      finally { setIsLoadingMCQs(false); }
    }
    if (!videoSuggestions || videoSuggestions.length === 0) { /* ... */ }
    
    // Lógica de auto-start do simulado removida
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedText, pdfName]); // Dependências do simulado removidas

  useEffect(() => {
    setCurrentSession(initialSession); 
    if (!initialSession.summary) setIsLoadingSummary(true);
    if (!initialSession.topics || initialSession.topics.length === 0) setIsLoadingTopics(true);
    if (!initialSession.glossary || initialSession.glossary.length === 0) setIsLoadingGlossary(true);
    if (!initialSession.questions || initialSession.questions.length === 0) setIsLoadingMCQs(true);
    if (!initialSession.videoSuggestions || initialSession.videoSuggestions.length === 0) setIsLoadingVideos(true);

    loadInitialData().then(() => {
        if (!initialSession.summary && extractedText) {
            generateSummary(extractedText).then(s => setCurrentSession(prev => ({ ...prev, summary: s }))).catch(e => setError(UI_TEXTS.geminiError + (e instanceof Error ? `: ${e.message}`: ''))).finally(() => setIsLoadingSummary(false));
        }
        if ((!initialSession.topics || initialSession.topics.length === 0) && extractedText) {
            generateTopics(extractedText).then(t => setCurrentSession(prev => ({ ...prev, topics: t.map((title, idx) => ({id: idx.toString(), title})) }))).catch(e => setError(UI_TEXTS.geminiError + (e instanceof Error ? `: ${e.message}`: ''))).finally(() => setIsLoadingTopics(false));
        }
        if ((!initialSession.glossary || initialSession.glossary.length === 0) && extractedText) {
            generateGlossary(extractedText).then(g => setCurrentSession(prev => ({ ...prev, glossary: g }))).catch(e => setError(UI_TEXTS.geminiError + (e instanceof Error ? `: ${e.message}`: ''))).finally(() => setIsLoadingGlossary(false));
        }
        // Questions (normal quiz) is handled by loadInitialData
        if ((!initialSession.videoSuggestions || initialSession.videoSuggestions.length === 0) && extractedText) {
             const mainTopic = initialSession.topics?.[0]?.title || initialSession.summary?.substring(0,50) || pdfName;
            generateVideoSuggestions(mainTopic || "tópico principal").then(v => setCurrentSession(prev => ({ ...prev, videoSuggestions: v }))).catch(e => console.error("Erro vídeos", e)).finally(() => setIsLoadingVideos(false));
        }
    });
  }, [initialSession, loadInitialData, extractedText, pdfName]);


  // --- Normal Quiz Handlers ---
  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !questions || !currentSession.score) return;
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQ.correctOptionId;
    setCurrentSession(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentQ.id]: selectedAnswer },
      score: {
        answered: prev.score!.answered + 1,
        correct: isCorrect ? prev.score!.correct + 1 : prev.score!.correct,
      }
    }));
    setShowAnswerFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    setShowAnswerFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };
  
  // --- Simulado Handlers Removidos ---


  const handleSave = () => {
    onSaveSession(currentSession);
    alert(UI_TEXTS.saveSession + " com sucesso!");
  };

  const renderSection = <T,>(title: string, IconComponent: React.FC, isLoading: boolean, data: T | T[] | undefined, renderContent: (data: T | T[]) => React.ReactNode, condition = true) => {
    if (!condition) return null;
    return (
    <Card className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-sky-600 dark:text-sky-400">
        <IconComponent /> {title}
      </h2>
      {isLoading ? <LoadingSpinner /> : (data && (Array.isArray(data) ? data.length > 0 : true) ? renderContent(data) : <p className="text-gray-500 dark:text-gray-400">{UI_TEXTS.noContentGenerated}</p>)}
    </Card>
  )};
  
  // @ts-ignore
  const apiKeyIsPlaceholder = import.meta.env.VITE_GEMINI_API_KEY === "COLE_AQUI_SUA_CHAVE_API_GEMINI_REAL";


  if (!extractedText && !initialSession.summary) { 
    return <div className="text-center p-8"><LoadingSpinner /> <p>{UI_TEXTS.loading}</p></div>;
  }
  
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Plano de Estudo para: <span className="text-sky-600 dark:text-sky-400">{pdfName}</span>
      </h1>
      
      {apiKeyIsPlaceholder && (
         <Card className="mb-8 bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600">
          <p className="text-yellow-700 dark:text-yellow-200 font-semibold">{UI_TEXTS.apiKeyWarning}</p>
        </Card>
      )}

      {error && <Card className="mb-8 bg-red-50 dark:bg-red-900 border-red-500 dark:border-red-400"><p className="text-red-700 dark:text-red-200 font-bold">{error}</p></Card>}

      {renderSection(UI_TEXTS.summary, SummaryIcon, isLoadingSummary, summary, (s) => <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{s as string}</p>)}
      
      {renderSection(UI_TEXTS.topics, TopicsIcon, isLoadingTopics, topics, (t) => (
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          {(t as StudyTopic[]).map(topic => <li key={topic.id}>{topic.title}</li>)}
        </ul>
      ))}

      {renderSection(UI_TEXTS.glossary, GlossaryIcon, isLoadingGlossary, glossary, (g) => (
        <div className="space-y-3">
          {(g as GlossaryEntry[]).map(entry => (
            <div key={entry.term}>
              <strong className="text-gray-800 dark:text-gray-200">{entry.term}:</strong> <span className="text-gray-600 dark:text-gray-400">{entry.definition}</span>
            </div>
          ))}
        </div>
      ))}

      {/* --- Quiz Interativo (Modificado) --- */}
      {renderSection(UI_TEXTS.quiz, QuizIcon, isLoadingMCQs, questions, (qList) => {
        if (!qList || (qList as Question[]).length === 0) {
           return <p className="text-gray-500 dark:text-gray-400">{isLoadingMCQs ? UI_TEXTS.loading : UI_TEXTS.noContentGenerated}</p>;
        }
        const currentQ = (qList as Question[])[currentQuestionIndex];
        if (!currentQ) return <p>{UI_TEXTS.noContentGenerated}</p>; // Fallback se o índice estiver fora

        if (quizFinished) {
          return (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Quiz Finalizado!</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300">Sua Pontuação: <span className="font-bold text-sky-600 dark:text-sky-400">{score?.correct} de {score?.answered}</span></p>
              <Button onClick={() => { setCurrentQuestionIndex(0); setQuizFinished(false); setSelectedAnswer(null); setShowAnswerFeedback(false); setCurrentSession(prev => ({...prev, score: {answered:0, correct:0}, userAnswers: {}})); }} className="mt-4" variant="secondary">
                Tentar Novamente o Quiz
              </Button>
            </div>
          );
        }
        return (
          <div>
            <p className="mb-2 text-gray-600 dark:text-gray-300">Questão {currentQuestionIndex + 1} de {(qList as Question[]).length}</p>
            <p className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{currentQ.questionText}</p>
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt: MCQOption) => (
                <label key={opt.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-150 ${selectedAnswer === opt.id ? 'bg-sky-100 dark:bg-sky-700 border-sky-500 dark:border-sky-400' : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-500'}`}>
                  <input type="radio" name={`question-${currentQ.id}`} value={opt.id} checked={selectedAnswer === opt.id} onChange={(e) => setSelectedAnswer(e.target.value)} disabled={showAnswerFeedback} className="form-radio h-5 w-5 text-sky-600 dark:text-sky-500 focus:ring-sky-500 dark:focus:ring-sky-600 border-gray-300 dark:border-gray-500 dark:bg-gray-600 mr-3"/>
                  <span className="text-gray-700 dark:text-gray-300">{opt.id}. {opt.text}</span>
                </label>
              ))}
            </div>
            {!showAnswerFeedback ? (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} variant="primary">
                {UI_TEXTS.answerQuestion}
              </Button>
            ) : (
              <div className={`mt-4 p-4 rounded-lg ${selectedAnswer === currentQ.correctOptionId ? 'bg-green-100 dark:bg-green-800 border border-green-500 dark:border-green-400' : 'bg-red-100 dark:bg-red-800 border border-red-500 dark:border-red-400'}`}>
                <div className={`flex items-center font-bold mb-2 ${selectedAnswer === currentQ.correctOptionId ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {selectedAnswer === currentQ.correctOptionId ? <CheckIcon /> : <XIcon />}
                  <span className="ml-2">{selectedAnswer === currentQ.correctOptionId ? UI_TEXTS.correctAnswer : UI_TEXTS.wrongAnswer}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{UI_TEXTS.yourAnswer} {currentQ.options.find(o => o.id === selectedAnswer)?.text}</p>
                {selectedAnswer !== currentQ.correctOptionId && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{UI_TEXTS.correctIs} {currentQ.options.find(o => o.id === currentQ.correctOptionId)?.text}</p>
                )}
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400"><span className="font-semibold">{UI_TEXTS.explanation}</span> {currentQ.explanation}</p>
                <Button onClick={handleNextQuestion} className="mt-4" variant="secondary">
                  {currentQuestionIndex < (qList as Question[]).length - 1 ? UI_TEXTS.nextQuestion : UI_TEXTS.showResults}
                </Button>
              </div>
            )}
          </div>
        );
      }, (!!questions) || isLoadingMCQs)}


      {/* --- Simulado de Prova Removido --- */}
      

      {renderSection(UI_TEXTS.videoSuggestions, VideoIcon, isLoadingVideos, videoSuggestions, (vids) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(vids as VideoSuggestion[]).map(video => (
            <Card key={video.id} className="flex flex-col">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-semibold text-md mb-1 text-gray-800 dark:text-gray-200 flex-grow">{video.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Duração: {video.duration}</p>
                <Button onClick={() => window.open(video.youtubeUrl, '_blank')} size="sm" variant="outline" className="w-full mt-auto">
                  {UI_TEXTS.watchVideo}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ), (!!videoSuggestions && videoSuggestions.length > 0) || isLoadingVideos)}
      
      <div className="mt-12 text-center">
        <Button onClick={handleSave} variant="primary" size="lg" className="shadow-lg">
          {UI_TEXTS.saveSession}
        </Button>
      </div>
    </div>
  );
};

export default StudyPageContent;