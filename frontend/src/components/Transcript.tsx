import React from 'react';
import { FileText } from 'lucide-react'; // Import the transcript icon

interface TranscriptProps {
  transcript: string;
}

export function Transcript({ transcript }: TranscriptProps) {
  const bulletPoints = transcript.split('.').filter(line => line.trim() !== '');

  return (
    <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {/* Title with Icon */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-gray-700" /> {/* Icon next to the title */}
        Transcript
      </h2>

      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <ul className="list-disc pl-6 text-gray-800 leading-relaxed">
          {bulletPoints.map((point, index) => (
            <li key={index} className="ml-4">{point.trim()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
