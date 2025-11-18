import React from "react";
import { useQuery } from "@tanstack/react-query";
import LatestMeasurement from "./components/LatestMeasurement";
import { fetchLatestData } from "./api/weatherApi";
import HistoryCharts from "./components/HistoryCharts";

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["latestData"], // ключ для кешу
    queryFn: fetchLatestData,
    refetchInterval: 600000, // кожні 10 хв
  });

  return (
    <div className="dashboard-container">
      <LatestMeasurement
        latestData={data}
        loading={isLoading}
        error={error ? error.message : null}
      />
      <HistoryCharts />
    </div>
  );
}

export default App;
