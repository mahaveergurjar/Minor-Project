import React, { useState } from 'react';
import { Youtube, ArrowRight, Video, PlayCircle, Clock, ChevronRight, Map, Sparkles } from 'lucide-react';
import SummaryLengthSlider from "./SummaryLengthSlider";

interface VideoInputProps {
  onSubmit: (url: string, summaryLength: string) => void; // ✅ Update function signature
  disabled?: boolean;
}

export function VideoInput({ onSubmit, disabled }: VideoInputProps) {
  const [url, setUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [summaryLength, setSummaryLength] = useState<string>("Normal"); // Default value

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url,summaryLength);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="card-hover bg-white rounded-xl shadow-sm p-4 pl-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-3xl font-semibold text-gray-900">Enter YouTube Video URL</h2>
            <PlayCircle className="ml-2 h-5 w-5 text-red-600" />
          </div>
          <div className="w-60 mt-2 mr-2"> 
            <SummaryLengthSlider summaryLength={summaryLength} setSummaryLength={setSummaryLength} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">Get Summary</span>
          </div>

          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Video className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-600">Get transcript</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Map className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">Generate Mind Map</span>
          </div>
          
          <ChevronRight className="h-4 w-4 text-gray-400 self-center" />
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">Save time</span>
          </div>
        </div>
        

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Youtube className="h-7 w-7 text-gray-400 mb-1 ml-2" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder=" https://youtube.com/watch?v=..."
              className="block w-full pl-10 mb-1 ml-2 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
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
