import React, { useState, useRef, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { uk } from 'date-fns/locale';
import { fetchHistoryData } from '../api/weatherApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const verticalLinePlugin = {
  id: 'verticalLine',
  afterDatasetsDraw: (chart) => {
    const { ctx, tooltip, chartArea: { top, bottom } } = chart;
    if (tooltip && tooltip._active && tooltip._active.length) {
      const activePoint = tooltip._active[0];
      const x = activePoint.element.x;
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.stroke();
      ctx.restore();
    }
  }
};

export default function HistoryCharts() {
  const [range, setRange] = useState('week');
  const chartRefOutdoor = useRef(null);
  const chartRefIndoor = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['history', range],
    queryFn: () => fetchHistoryData(range),
    staleTime: 1000 * 60 * 20,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    return () => {
      if (chartRefOutdoor.current) {
        chartRefOutdoor.current.destroy?.();
      }
      if (chartRefIndoor.current) {
        chartRefIndoor.current.destroy?.();
      }
    };
  }, []);

  if (isLoading) return <div className="card center-text"><p>Завантаження графіків<span className="loading-dots"></span></p></div>;
  if (error) return <div className="card center-text"><p>Помилка: {error.message}</p></div>;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
        duration: 200, 
        easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 10,
        displayColors: true,
        callbacks: {
           label: function(context) {
             let label = context.dataset.label || '';
             if (label) label += ': ';
             if (context.parsed.y !== null) {
                 label += context.parsed.y;
                 if (context.dataset.yAxisID === 'y1' && context.dataset.label.includes('Тиск')) label += ' hPa';
                 else if (context.dataset.yAxisID === 'y1' && context.dataset.label.includes('Вологість')) label += ' %';
                 else if (context.dataset.label.includes('Температура')) label += ' °C';
                 else if (context.dataset.label.includes('Вологість')) label += ' %';
             }
             return label;
           }
        }
      },
      verticalLine: true
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'dd.MM.yyyy HH:mm',
          displayFormats: { day: 'dd.MM', hour: 'HH:mm' },
        },
        adapters: { date: { locale: uk } },
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          font: { size: 11 }
        }
      },
    },
  };

  // вуличний
  const outdoorOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: { display: true, text: 'Вуличний модуль', font: { size: 18, weight: 'normal' }, color: '#555' },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: '°C / %' },
        grid: { color: '#f0f0f0' },
        min: -30,
        max: 100,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'hPa' },
        grid: { drawOnChartArea: false },
        min: 800,
        max: 1100,
      },
    },
  };

  // кімнатний
  const indoorOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: { display: true, text: 'Кімнатний модуль', font: { size: 18, weight: 'normal' }, color: '#555' },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: '°C' },
        grid: { color: '#f0f0f0' },
        min: -30,  
        max: 100,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: '%' },
        grid: { drawOnChartArea: false }, 
        min: 0,
        max: 100,
      },
    },
  };

  const lineStyle = {
    tension: 0.1, 
    pointRadius: 0,
    pointHoverRadius: 6,
    borderWidth: 2,
    fill: false,
  };

  // дані
  const outdoorData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: 'Температура',
        data: data.map((d) => d.bmeT),
        borderColor: '#FF9F40',
        backgroundColor: '#FF9F40',
        yAxisID: 'y',
        ...lineStyle,
      },
      {
        label: 'Вологість',
        data: data.map((d) => d.bmeH),
        borderColor: '#4BC0C0',
        backgroundColor: '#4BC0C0',
        yAxisID: 'y',
        ...lineStyle,
      },
      {
        label: 'Тиск',
        data: data.map((d) => d.bmeP),
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        yAxisID: 'y1',
        ...lineStyle,
      },
    ],
  };

  const indoorData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label: 'Температура',
        data: data.map((d) => d.htuT),
        borderColor: '#FF9F40',
        backgroundColor: '#FF9F40',
        yAxisID: 'y',  
        ...lineStyle,
      },
      {
        label: 'Вологість',
        data: data.map((d) => d.htuH),
        borderColor: '#4BC0C0',
        backgroundColor: '#4BC0C0',
        yAxisID: 'y1', 
        ...lineStyle,
      },
    ],
  };

  return (
    <div className="history-container">
      <div className="controls card center-text">
        <div className="button-group">
          {['week', 'month', 'half_year', 'year', 'all'].map((r) => (
             <button 
               key={r} 
               className={range === r ? 'active' : ''} 
               onClick={() => setRange(r)}
             >
               {r === 'week' && 'Тиждень'}
               {r === 'month' && 'Місяць'}
               {r === 'half_year' && '6 Місяців'}
               {r === 'year' && 'Рік'}
               {r === 'all' && 'Всі'}
             </button>
          ))}
        </div>
      </div>

      <div className="chart-card card">
        <Line options={outdoorOptions} data={outdoorData} plugins={[verticalLinePlugin]} />
      </div>
      
      <div className="chart-card card">
        <Line options={indoorOptions} data={indoorData} plugins={[verticalLinePlugin]} />
      </div>
    </div>
  );
}