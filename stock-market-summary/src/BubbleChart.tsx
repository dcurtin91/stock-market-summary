
import { Bubble } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { db } from './Firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type Collection = {
  id: string;
  timestamp: string;
  top_gainers: Array<{
    symbol: string;
    price: string;
    change: string;
    changesPercentage: string;
    name: string;
  }>;
};

function GetGainers(callback: (gainers: Collection[]) => void): () => void {
  const q = query(
    collection(db, 'top-gainers'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const gainersData = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        top_gainers: data.top_gainers || [],
        timestamp: data.timestamp || '',
      };
    });

    if (typeof callback === 'function') {
      callback(gainersData);
    }
  });

  return unsubscribe;
}




const BubbleChart = () => {
  const [topGainers, setTopGainers] = useState<Collection[]>([]);

  useEffect(() => {
    const unsubscribe = GetGainers((fetchedGainers) => {
      setTopGainers(fetchedGainers);
    });

    return unsubscribe;
  }, []);

  const gainersData = topGainers.flatMap((gainer) =>
    gainer.top_gainers.map((stock) => ({
      x: parseFloat(stock.changesPercentage), // Changes percentage
      y: parseFloat(stock.change),           // Price change
      r: 10,                                 // Size of the bubble
      stock: stock.symbol,                   // Stock symbol (for tooltip)
    }))
  );

  const data = {
    datasets: [
     
      {
        label: 'Top Gainers',
        data: gainersData,
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
