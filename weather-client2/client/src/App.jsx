import React, { useState, useEffect } from "react";
import axios from "axios";
import LatestMeasurement from "./components/LatestMeasurement";

function App() {
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/data/latest`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        setError(null);

        const response = await axios.get(API_URL);

        setLatestData(response.data);
      } catch (err) {
        setError("Не вдалося завантажити дані");
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, [API_URL]); 

  
  return (
    <LatestMeasurement
      latestData={latestData}
      loading={loading}
      error={error}
    />
  );
}

export default App;
