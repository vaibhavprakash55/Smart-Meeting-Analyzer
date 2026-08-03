import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, FileText, Sparkles, Check } from 'lucide-react';

export default function Result({ data }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.summary || data.insights || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('summary-content');
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin:       0.5,
        filename:     `Meeting_Summary_${new Date().toISOString().slice(0, 10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf.default().set(opt).from(element).save();
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Transcript - Left Side */}
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center gap-2 px-2 text-sm font-bold text-indigo-400 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          Raw Transcript
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl h-[400px] overflow-y-auto text-slate-400 leading-relaxed italic">
          "{data.transcript || "No transcript generated."}"
        </div>
      </div>

      {/* AI Intelligence - Right Side */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Insights
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition"
              title="Copy Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs flex items-center gap-1.5 font-medium transition shadow-lg shadow-indigo-600/20"
              title="Export as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>

        {/* AI Content Container */}
        <div 
          id="summary-content" 
          className="bg-gradient-to-br from-indigo-500/[0.07] to-emerald-500/[0.07] border border-white/10 p-8 rounded-2xl shadow-inner min-h-[400px] max-h-[500px] overflow-y-auto"
        >
          <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed">
            <ReactMarkdown>
              {data.summary || data.insights || "No summary available."}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}