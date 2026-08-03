import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, FileText, Sparkles, Check, Activity, ListChecks, MessageSquare, Cpu } from 'lucide-react';

export default function Result({ data }) {
  const [copied, setCopied] = useState(false);

  const wordCount = data.transcript ? data.transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleCopy = () => {
    const textToCopy = data.summary || data.insights || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const content = data.summary || data.insights || 'No summary content';
    const rawTranscript = data.transcript || 'No transcript available';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meeting Summary - IntelliMinutes</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; }
            h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; margin-bottom: 8px; }
            .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
            .section { margin-bottom: 28px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .section-title { font-size: 14px; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
            .content { line-height: 1.6; font-size: 14px; color: #334155; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>IntelliMinutes - Meeting Summary Report</h1>
          <div class="meta">Generated on: ${new Date().toLocaleString()}</div>
          
          <div class="section">
            <div class="section-title">AI Summary & Insights</div>
            <div class="content">${content}</div>
          </div>

          <div class="section">
            <div class="section-title">Raw Transcript</div>
            <div class="content">"${rawTranscript}"</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Word Count</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-white mt-2">{wordCount}</span>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Action Items</span>
            <ListChecks className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-400 mt-2">
            {(data.summary || "").toLowerCase().includes("action item") ? "Extracted" : "None"}
          </span>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tone / Sentiment</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-base font-semibold text-slate-200">Productive</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Model</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-base font-semibold text-purple-300 mt-2">Llama-3 (Groq)</span>
        </div>
      </div>

      {/* 2. Main Content Grid */}
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
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                title="Copy Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs flex items-center gap-1.5 font-medium transition shadow-lg shadow-indigo-600/20 cursor-pointer"
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
    </div>
  );
}