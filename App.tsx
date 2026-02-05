import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateCPTP } from './services/geminiService';
import { FormData } from './types';

const App: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedHtml = await generateCPTP(data);
      setResult(generatedHtml);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        <div className="space-y-8">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              CAPAIAN PEMBELAJARAN & TUJUAN PJOK
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Buat tabel perangkat ajar PJOK yang terstruktur lengkap dengan Fase A, B, dan C secara otomatis menggunakan AI. Siap tempel ke Dokumen.
            </p>
          </div>

          <InputForm onSubmit={handleSubmit} isLoading={loading} />

          {error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded shadow-sm animate-pulse">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <ResultDisplay content={result} />
          )}

        </div>
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Generator PJOK SD. Dibuat dengan Teknologi AI Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;