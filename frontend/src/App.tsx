import React, { useState } from "react";
import { VideoInput } from "./components/VideoInput";
import { Transcript } from './components/Transcript';
import { Summary } from "./components/Summary";
import MindMap from "./components/MindMap";
import { analyzeVideo } from "./api";
import {Youtube, Sparkles, Loader2 } from "lucide-react";

function App() {
  const [videoData, setVideoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSubmit = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeVideo(url);

      console.log("Central Topic:", data.central);
      console.log("Mind Map Data:", data.mind_map);

      // Create central node
      const centralNode = { id: "central", label: data.central };

      // Create keyword nodes and their description nodes
      const keywordNodes = Object.keys(data.mind_map).map((key, index) => ({
        id: `node-${index}`,
        label: key,
      }));

      const descriptionNodes = Object.keys(data.mind_map).flatMap((key, index) => {
        return data.mind_map[key].map((desc, descIndex) => ({
          id: `desc-${index}-${descIndex}`,
          label: desc,
        }));
      });

      // Create links from central node to keywords
      const keywordLinks = keywordNodes.map((node) => ({
        source: "central",
        target: node.id,
      }));

      // Create links from keywords to descriptions
      const descriptionLinks = Object.keys(data.mind_map).flatMap((key, index) => {
        return data.mind_map[key].map((_, descIndex) => ({
          source: `node-${index}`,
          target: `desc-${index}-${descIndex}`,
        }));
      });

      setVideoData({
        summary: data.summary,
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
    <>
    <div className="min-h-screen gradient-bg">
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Youtube className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  YouTube Summarizer
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">
                AI-Powered Analysis
              </span>
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
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Analyzing video...</span>
          </div>
        )}

        {videoData && !loading && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
            <div>
              <Summary summary={videoData.summary} />
            </div>
            <div>
              <Transcript transcript={videoData.transcript} />              
            </div>
            
          </div>
          <div className="mt-4">
          <MindMap
            nodes={videoData.mindMap.nodes}
            links={videoData.mindMap.links}
            central={videoData.mindMap.central}
          />
        </div>
          </>
        )}
      </main>
    </div>
    </>
  );
}

export default App;
