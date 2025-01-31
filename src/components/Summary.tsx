import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface SummaryProps {
  summary: string;
  currentLanguage: Language;
}

export function Summary({ summary, currentLanguage }: SummaryProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
    script.defer = true;
    document.body.appendChild(script);

    window.gtranslateSettings = {
      "default_language": "en",
      "detect_browser_language": true,
      "wrapper_selector": ".gtranslate_wrapper",
      "languages": ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"]
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-400" />
          <div className="gtranslate_wrapper"></div>
        </div>
      </div>
      <div className="prose max-w-none" id="summary-content">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}