
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { MOTIVATIONAL_MESSAGES, UI_TEXTS } from '../constants';

interface HomePageContentProps {
  onStart: () => void;
}

// Ícone SVG diretamente no componente
const AcademicCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-sky-500 dark:text-sky-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

const HomePageContent: React.FC<HomePageContentProps> = ({ onStart }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Seleciona uma mensagem motivacional aleatória ao carregar
    setCurrentMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 min-h-[calc(100vh-10rem)]"> {/* Ajuste de altura para centralizar melhor */}
      <AcademicCapIcon />
      <h1 className="text-4xl sm:text-5xl font-bold my-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-emerald-500 dark:from-sky-400 dark:to-emerald-400">
        Bem-vindo ao Estudo Inteligente AI!
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Transforme seus PDFs de estudo em resumos, quizzes e encontre videoaulas relevantes. Tudo com o poder da Inteligência Artificial!
      </p>
      <blockquote className="italic text-md text-gray-500 dark:text-gray-400 border-l-4 border-sky-500 dark:border-sky-400 pl-4 py-2 mb-10 max-w-xl">
        {currentMessage || "Carregando inspiração..."}
      </blockquote>
      <Button onClick={onStart} size="lg" variant="primary" className="shadow-lg hover:shadow-xl transform hover:scale-105">
        {UI_TEXTS.startStudying}
      </Button>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {[
          { title: "Upload Fácil", description: "Envie seus PDFs de aula com apenas alguns cliques.", icon: "📄" },
          { title: "IA Poderosa", description: "Resumos, tópicos e glossários gerados automaticamente.", icon: "💡" },
          { title: "Aprendizado Interativo", description: "Teste seus conhecimentos com quizzes personalizados.", icon: "🎯" }
        ].map(feature => (
          <div key={feature.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-sky-600 dark:text-sky-400">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePageContent;
