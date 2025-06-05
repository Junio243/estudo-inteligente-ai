
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../constants';

interface PageShellProps {
  children: React.ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const location = useLocation();

  // Definição de ícones SVG como componentes React simples para evitar dependências de biblioteca de ícones no runtime
  const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
  const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
  const StudyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
  const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  // Usamos um emoji para representar o cérebro e evitar problemas com o caminho SVG incorreto
  const BrainIcon = () => (
    <span role="img" aria-label="Cérebro" className="text-2xl">
      🧠
    </span>
  );


  const navItems = [
    { path: '/', label: 'Início', icon: <HomeIcon /> },
    { path: '/upload', label: 'Upload', icon: <UploadIcon /> },
    { path: '/study', label: 'Estudar', icon: <StudyIcon /> },
    { path: '/history', label: 'Histórico', icon: <HistoryIcon /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-sky-600 dark:text-sky-400">
              <BrainIcon />
              <span>{APP_NAME}</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2
                    ${location.pathname === item.path 
                      ? 'bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-200' 
                      : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    } transition-colors duration-150 ease-in-out`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            {/* Botão de menu para mobile */}
            <div className="md:hidden">
              {/* Implementar um dropdown ou similar para mobile se necessário */}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Navegação mobile fixa na parte inferior */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full p-2
                ${location.pathname === item.path 
                  ? 'text-sky-600 dark:text-sky-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-300'
                } transition-colors duration-150 ease-in-out`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      {/* Espaçador para compensar a navbar mobile fixa */}
      <div className="md:hidden h-16"></div>


      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.</p>
          <p>Feito Por Alexandre Junio Canuto Lopes <span className="text-red-500 animate-pulse">❤️</span> para estudantes em geral .</p>
        </div>
      </footer>
    </div>
  );
};

export default PageShell;
