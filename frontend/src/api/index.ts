import axios from 'axios';

// Update this URL to point to your deployed Python backend
const API_URL ='http://localhost:5000/summarize';

export const analyzeVideo = async (videoUrl: string) => {
  try {
    const response = await axios.post(`${API_URL}`, {video_url:videoUrl}, {
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};