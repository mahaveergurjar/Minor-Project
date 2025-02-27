import React, { useState } from "react";
import { VideoInput } from "./components/VideoInput";
import { Transcript } from "./components/Transcript";
import { Summary } from "./components/Summary";
import MindMap from "./components/MindMap";
import { analyzeVideo } from "./api";
import { Youtube, Sparkles, Loader2 } from "lucide-react";
import LanguageSelector from "./components/LanguageSelector";

interface VideoData {
  summary: string;
  transcript: string;
  mindMap: {
    central: string;
    nodes: { id: string; label: string }[];
    links: { source: string; target: string }[];
  };
}

function App() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleVideoSubmit = async (url: string, summaryLength: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeVideo(url, selectedLanguage, summaryLength);

      // Mind map generation
      const centralNode = { id: "central", label: data.central };
      const keywordNodes = Object.keys(data.mind_map).map((key, index) => ({
        id: `node-${index}`,
        label: key,
      }));
      const descriptionNodes = Object.keys(data.mind_map).flatMap((key, index) =>
        data.mind_map[key].map((desc, descIndex) => ({
          id: `desc-${index}-${descIndex}`,
          label: desc,
        }))
      );
      const keywordLinks = keywordNodes.map((node) => ({
        source: "central",
        target: node.id,
      }));
      const descriptionLinks = Object.keys(data.mind_map).flatMap((key, index) =>
        data.mind_map[key].map((_, descIndex) => ({
          source: `node-${index}`,
          target: `desc-${index}-${descIndex}`,
        }))
      );

      setVideoData({
        summary: data.summary,
        transcript: data.transcription,
        mindMap: {
          central: data.central,
          nodes: [centralNode, ...keywordNodes, ...descriptionNodes],
          links: [...keywordLinks, ...descriptionLinks],
        },
      });
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
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
              <Youtube className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                YouTube Summarizer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">
                AI-Powered Analysis
              </span>
              <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-xl p-6 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex-1">
              <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
              
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600 mt-8 p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Analyzing video...</span>
          </div>
        )}
        {videoData && !loading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
              <Summary summary={videoData.summary} />
              <Transcript transcript={videoData?.transcript || "Transcript not available"} />
            </div>
            <div className="mt-4">
              <MindMap nodes={videoData.mindMap.nodes} links={videoData.mindMap.links} central={videoData.mindMap.central} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;