import React, { useState, useEffect } from "react";
import { VideoInput } from "./components/VideoInput";
import { Transcript } from './components/Transcript';
import { Summary } from "./components/Summary";
import MindMap from "./components/MindMap";
import { analyzeVideo, translateSummary } from "./api";
import { Youtube, Sparkles, Loader2 } from "lucide-react";
import LanguageSelector from "./components/LanguageSelector";

function App() {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);

  // Add this effect to handle language changes
  useEffect(() => {
    if (videoData?.summary && selectedLanguage !== "en") {
      handleTranslateSummary(videoData.summary, selectedLanguage);
    } else if (selectedLanguage === "en") {
      // Reset to original summary when switching back to English
      setTranslatedSummary(null);
    }
  }, [selectedLanguage, videoData]);

  const handleVideoSubmit = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeVideo(url);

      // Create central node
      const centralNode = { id: "central", label: data.central };

      // Create keyword nodes
      const keywordNodes = Object.keys(data.mind_map).map((key, index) => ({
        id: `node-${index}`,
        label: key,
      }));

      // Create description nodes
      const descriptionNodes = Object.keys(data.mind_map).flatMap((key, index) =>
        data.mind_map[key].map((desc, descIndex) => ({
          id: `desc-${index}-${descIndex}`,
          label: desc,
        }))
      );

      // Create links from central node to keywords
      const keywordLinks = keywordNodes.map((node) => ({
        source: "central",
        target: node.id,
      }));

      // Create links from keywords to descriptions
      const descriptionLinks = Object.keys(data.mind_map).flatMap((key, index) =>
        data.mind_map[key].map((_, descIndex) => ({
          source: `node-${index}`,
          target: `desc-${index}-${descIndex}`,
        }))
      );

      setVideoData({
        summary: data.summary,
        transcript: data.transcript,
        mindMap: {
          central: data.central,
          nodes: [centralNode, ...keywordNodes, ...descriptionNodes],
          links: [...keywordLinks, ...descriptionLinks],
        },
      });

      // Only translate if not English
      if (selectedLanguage !== "en") {
        handleTranslateSummary(data.summary, selectedLanguage);
      }
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateSummary = async (summary: string, language: string) => {
    console.log(`Translating to ${language}:`, summary.substring(0, 30) + "...");
    
    try {
      const translatedData = await translateSummary(summary, language);
      console.log("Translation response:", translatedData);
      setTranslatedSummary(translatedData.translated_summary);
    } catch (err) {
      console.error("Translation failed:", err);
      setTranslatedSummary(null);
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
              <span className="text-sm font-medium text-gray-600">AI-Powered Analysis</span>
              <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <VideoInput onSubmit={handleVideoSubmit} disabled={loading} />
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
              <Summary 
                summary={selectedLanguage === "en" ? videoData.summary : (translatedSummary || videoData.summary)} 
                isTranslated={selectedLanguage !== "en" && !!translatedSummary}
              />
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