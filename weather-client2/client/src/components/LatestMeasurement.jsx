import React from "react";

// utc time to Kyiv local time
function formatToKyiv(time) {
  if (!time) return "—";
  try {
    const d = new Date(time);
    return d.toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
  } catch (e) {
    return new Date(time).toLocaleString();
  }
}

// Компонент для відображення останніх вимірювань
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

  // Визначення статусу станції
  let statusText = null;
  let statusClass = null;

  if (latestData) {
    const now = new Date();
    const lastMeasurementTime = new Date(latestData.time);
    const diffMs = now.getTime() - lastMeasurementTime.getTime();
    const oneHourInMs = 3600000; // 1 година

    if (diffMs > oneHourInMs) {
      statusText = "Відключена";
      statusClass = "status-disconnected";
    } else {
      statusText = "Активна";
      statusClass = "status-active";
    }
  }

  // Відображення даних останнього запису
  return (
    <div className="last-measurement">
      {latestData ? (
        <div className="card last-measurement__container">
          <div className="text-block">
            <h1>Дані метеостанції</h1>
            <p>
              <strong>Статус: </strong>
              <span className={statusClass}>{statusText}</span>
            </p>
          </div>
          <div className="text-block">
            <h2>Останній запис:</h2>
            <p>
              <strong>Дата:</strong> {formatToKyiv(latestData.time)}
            </p>
          </div>
          <div className="text-block">
            <h2>Кімнатний модуль</h2>
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
          </div>
          <div className="text-block">
            <h2>Вуличний модуль</h2>
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
        </div>
      ) : (
        <div className="card center-text">
          <p>Даних немає</p>
        </div>
      )}
    </div>
  );
}
