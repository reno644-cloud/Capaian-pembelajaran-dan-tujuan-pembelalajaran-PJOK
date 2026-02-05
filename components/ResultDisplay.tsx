import React, { useRef, useState } from 'react';

interface ResultDisplayProps {
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleCopyAndOpenDocs = async () => {
    if (!contentRef.current) return;

    try {
      // 1. Get HTML content
      const htmlContent = contentRef.current.innerHTML;
      
      // 2. Create blobs for clipboard
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      // Create a plain text fallback
      const textBlob = new Blob([contentRef.current.innerText], { type: 'text/plain' });

      // 3. Write to clipboard
      const data = [new ClipboardItem({ 
        'text/html': htmlBlob,
        'text/plain': textBlob
      })];
      
      await navigator.clipboard.write(data);
      
      setCopyStatus('copied');
      
      // 4. Open Google Docs in new tab
      // Opening 'create' directly creates a blank new doc immediately
      window.open('https://docs.google.com/document/create', '_blank');

      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const handleDownloadWord = () => {
    // Prepare HTML content for Word
    // Note: We inject specific styles to ensure Word renders it correctly with black text and borders
    const preHtml = `<!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
    <meta charset='utf-8'>
    <title>Export HTML to Word Document</title>
    <style>
    body { font-family: 'Times New Roman', serif; color: #000000; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; color: #000000; }
    h1, h2, h3, p { color: #000000; }
    </style>
    </head>
    <body>`;
    
    const postHtml = "</body></html>";
    const html = preHtml + content + postHtml;

    // Create a Blob with the HTML content
    // 'application/msword' helps the browser trigger Word
    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CP_TP_PJOK_SD.doc';
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 md:p-8 mt-8 animate-fade-in-up">
       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 pb-6 border-b border-slate-700 gap-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="bg-green-900 text-green-300 border border-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
          Hasil Rencana Pembelajaran
        </h2>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            <button
              onClick={handleDownloadWord}
              className="flex-1 xl:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 shadow-sm"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Download Word (.doc)
            </button>

            <button
              onClick={handleCopyAndOpenDocs}
              className={`flex-1 xl:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                copyStatus === 'copied' 
                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                  : 'bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white hover:border-slate-500'
              }`}
            >
              {copyStatus === 'copied' ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Tersalin!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  Salin ke Google Docs
                </>
              )}
            </button>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-slate-400">Pratinjau Dokumen (Tampilan Standar Kertas)</p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-slate-600 overflow-x-auto shadow-inner">
        <div 
            ref={contentRef}
            className="prose prose-sm max-w-none prose-table:border-collapse prose-td:border prose-td:border-black prose-td:p-2 prose-th:border prose-th:border-black prose-th:bg-gray-100 prose-th:text-black prose-th:font-bold prose-th:p-2 font-serif text-black [&_*]:text-black"
            dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-center">
        *Tips: Gunakan tombol <strong>Download Word</strong> untuk file offline, atau <strong>Salin</strong> untuk menempel di Google Docs/Canva.
      </div>
    </div>
  );
};

export default ResultDisplay;