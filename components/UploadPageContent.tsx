
import React, { useState, useCallback, useEffect } from 'react';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import { UI_TEXTS } from '../constants';
import type { UploadedPdf } from '../types';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// Configura o worker para pdf.js
if (typeof window !== 'undefined') {
  // Usa o caminho do módulo que será resolvido pelo importmap
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';
}


interface UploadPageContentProps {
  onPdfProcessed: (pdf: UploadedPdf) => void;
}

// Ícone SVG diretamente no componente
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const DocumentIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-sky-500 dark:text-sky-400">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>
);


const UploadPageContent: React.FC<UploadPageContentProps> = ({ onPdfProcessed }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // Para a barra de progresso

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSelectedFile(null);
    setProgress(0);
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        setError(UI_TEXTS.pdfUploadError);
      }
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      setError(UI_TEXTS.selectPdf);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
        setProgress(Math.round((i / numPages) * 100));
      }
      
      if (!fullText.trim()) {
        setError("Não foi possível extrair texto do PDF. O arquivo pode estar vazio ou ser uma imagem.");
        setIsProcessing(false);
        setProgress(0);
        return;
      }

      onPdfProcessed({ name: selectedFile.name, extractedText: fullText.trim() });
      setSelectedFile(null); // Limpa o campo após o processamento
      
    } catch (e) {
      console.error("Erro ao processar PDF:", e);
      setError(`Erro ao processar PDF: ${e instanceof Error ? e.message : String(e)}. Verifique se o arquivo é um PDF válido e não protegido.`);
    } finally {
      setIsProcessing(false);
      // Não resetar o progresso aqui para que a barra cheia seja visível brevemente
      // Se não houve erro, será resetado ao selecionar novo arquivo ou navegar.
    }

  }, [selectedFile, onPdfProcessed]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <DocumentIcon />
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-600 dark:text-sky-400 mt-2">
          {UI_TEXTS.uploadPdf}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Envie seu material de estudo em formato PDF para começar a mágica!
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">{UI_TEXTS.errorOccurred}</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {UI_TEXTS.selectPdf}:
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-sky-50 dark:file:bg-sky-700 file:text-sky-700 dark:file:text-sky-200
            hover:file:bg-sky-100 dark:hover:file:bg-sky-600
            disabled:opacity-50 transition-colors duration-150"
          disabled={isProcessing}
        />
      </div>

      {selectedFile && !isProcessing && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-1">{UI_TEXTS.pdfPreview}:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Nome:</span> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Tamanho:</span> {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-6">
          <p className="text-sm text-sky-600 dark:text-sky-400 mb-2 text-center">{UI_TEXTS.processingPdf}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-200 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <LoadingSpinner className="mx-auto mt-4" />
        </div>
      )}

      <Button 
        onClick={handleSubmit} 
        disabled={!selectedFile || isProcessing}
        className="w-full flex items-center justify-center"
        variant="primary"
        size="lg"
      >
        <UploadIcon />
        {isProcessing ? UI_TEXTS.processingPdf : UI_TEXTS.uploadPdf}
      </Button>
    </div>
  );
};

export default UploadPageContent;