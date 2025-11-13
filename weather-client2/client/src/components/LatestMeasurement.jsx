import React from "react";

function formatToKyiv(time) {
  if (!time) return "—";
  try {
    const d = new Date(time);
    return d.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
  } catch (e) {
    return new Date(time).toLocaleString();
  }
}

export default function LatestMeasurement({ latestData, loading, error }) {
  if (loading) {
    return (
      <div className="last-measurement">
        <div className="card center-text">
          <p>
            Завантаження<span className="loading-dots"></span>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="last-measurement">
        <div className="card center-text">
          <p>Помилка: {error}</p>
        </div>
      </div>
    );
  }

  // Відображення даних останнього запису
  return (
    <div className="last-measurement">
      {latestData ? (
        <div className="card">
          <h1>Дані метеостанції</h1>
          <h2>Останній запис:</h2>
          <p>
            <strong>Дата:</strong> {formatToKyiv(latestData.time)}
          </p>

          <h3>Кімнатний модуль</h3>
          <p>
            <strong>Температура:</strong>{" "}
            {typeof latestData.htuT === "number"
              ? latestData.htuT.toFixed(2)
              : "—"}{" "}
            °C
          </p>
          <p>
            <strong>Відносна вологість:</strong>{" "}
            {typeof latestData.htuH === "number"
              ? latestData.htuH.toFixed(2)
              : "—"}{" "}
            %
          </p>

          <h3>Вуличний модуль</h3>
          <p>
            <strong>Температура:</strong>{" "}
            {typeof latestData.bmeT === "number"
              ? latestData.bmeT.toFixed(2)
              : "—"}{" "}
            °C
          </p>
          <p>
            <strong>Відносна вологість:</strong>{" "}
            {typeof latestData.bmeH === "number"
              ? latestData.bmeH.toFixed(2)
              : "—"}{" "}
            %
          </p>
          <p>
            <strong>Атмосферний тиск:</strong>{" "}
            {typeof latestData.bmeP === "number"
              ? latestData.bmeP.toFixed(2)
              : "—"}{" "}
            гПа
          </p>
        </div>
      ) : (
        <div className="card center-text">
          <p>Даних немає</p>
        </div>
      )}
    </div>
  );
}
