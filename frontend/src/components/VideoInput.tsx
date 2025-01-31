import React, { useState } from 'react';
import { Youtube, ArrowRight } from 'lucide-react';

interface VideoInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export function VideoInput({ onSubmit, disabled }: VideoInputProps) {
  const [url, setUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter YouTube Video URL</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Youtube className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
              disabled={disabled}
            />
          </div>
          <button
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center gap-2 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={disabled}
          >
            Analyze
            <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    </form>
  );
}