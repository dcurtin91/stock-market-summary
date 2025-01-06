
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BubbleChart = () => {
  const data = {
    datasets: [
     
      {
        label: 'Top Gainers',
        data: [
          { x: 177.5687, y: 0.614, r: 5, stock: 'Stock C' },
          { x: 146.729, y: 1.57, r: 20, stock: 'Stock D' },
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Top Losers',
        data: [
          { x: 3, y: 1500, r: 10, stock: 'Stock E' },
          { x: 7, y: 2500, r: 18, stock: 'Stock F' },
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const { x, y, r } = context.raw;
            const stock = context.raw.stock;
            return `Stock: ${stock}\nChanges Percentage: ${x}%\nPrice Change: $${y}\nSize: ${r}`;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Changes Percentage (%)',
        },
        min: -100,
        max: 200,
      },
      y: {
        title: {
          display: true,
          text: 'Price Change ($)',
        },
        min: -50.00,
        max: 50.00,
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <h2>Stock Market Bubble Chart</h2>
      <p>Large Circles = Market Most Active</p>
      <Bubble data={data} options={options} />
    </div>
  );
};

export default BubbleChart;
