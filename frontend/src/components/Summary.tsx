import React from 'react';
import ReactMarkdown from 'react-markdown';
import {FileText} from "lucide-react";


interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
        
      </div>
      <div className="prose max-w-none" id="summary-content">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}