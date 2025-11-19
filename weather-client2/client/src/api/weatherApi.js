import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHistoryData = async (range) => {
  const response = await axios.get(`${API_BASE_URL}/api/data/history`, {
    params: { range }, 
  });
  return response.data;
};

export const fetchLatestData = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/data/latest`);
  return response.data;
};