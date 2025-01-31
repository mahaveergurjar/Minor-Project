import React from 'react';

interface TranscriptProps {
  transcript: string;
}

export function Transcript({ transcript }: TranscriptProps) {
  return (
    <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Transcript</h2>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">{transcript}</p>
      </div>
    </div>
  );
}