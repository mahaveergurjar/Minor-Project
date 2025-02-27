import axios from 'axios';

// Backend API URLs
const API_URL = 'http://localhost:5000/summarize';

// Function to analyze video
export const analyzeVideo = async (videoUrl: string, language: string, summaryLength: string ) => {
  try {
    const response = await axios.post(`${API_URL}`, { 
      video_url: videoUrl, 
      lang: language,
      summary_length: summaryLength, 
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};


