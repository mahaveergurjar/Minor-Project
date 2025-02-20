import axios from 'axios';

// Backend API URLs
const API_URL = 'http://localhost:5000/summarize';
const TRANSLATE_API_URL = 'http://localhost:5000/translate'; // Update based on backend route

// Function to analyze video
export const analyzeVideo = async (videoUrl: string) => {
  try {
    const response = await axios.post(`${API_URL}`, { video_url: videoUrl });
    return response.data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};

// Function to translate summary
export const translateSummary = async (summary: string, language: string) => {
  try {
    const response = await axios.post(`${TRANSLATE_API_URL}`, {
      text: summary,  // Changed key from 'summary' to 'text'
      language,
    });

    return response.data; // Expecting { translated_summary: "translated text" }
  } catch (error) {
    console.error('Error translating summary:', error);
    throw error;
  }
};

