import React, { useState } from 'react';
import { VideoInput } from './components/VideoInput';
import { Summary } from './components/Summary';
import { Transcript } from './components/Transcript';
import { MindMap } from './components/MindMap';
import { Language, VideoData } from './types';
import { Brain, FileText, Youtube, Sparkles, Loader2 } from 'lucide-react';
import { analyzeVideo } from './api';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSubmit = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeVideo(url);
      setVideoData({
        id: url,
        title: 'Video Analysis',
        summary: data.summary,
        // transcript: data.transcript,
        // mindMap: data.mindMap.nodes
      });
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Youtube className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  YouTube Summarizer
                </h1>
                <p className="text-sm text-gray-600">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8 animate-fade-in">
          <div className="w-full max-w-3xl">
            <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing video...</span>
            </div>
          )}

          {videoData && !loading && (
            <div className="w-full space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Analysis</h2>
                      <p className="text-sm text-gray-600">Summary and transcript</p>
                    </div>
                  </div>
                  <Summary summary={videoData.summary} currentLanguage={currentLanguage} />
                  {/* <Transcript transcript={videoData.transcript} /> */}
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Mind Map</h2>
                      <p className="text-sm text-gray-600">Visual concept representation</p>
                    </div>
                  </div>
                  {/* <MindMap data={videoData.mindMap} /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            Designed For Students And Learners
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;