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
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);
ChartJS.register(zoomPlugin);

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

type Collection2 = {
  id: string;
  timestamp: string;
  top_losers: Array<{
    symbol: string;
    price: string;
    change: string;
    changesPercentage: string;
    name: string;
  }>;
};

type Collection3 = {
  id: string;
  timestamp: string;
  most_actively_traded: Array<{
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

function GetLosers(callback: (losers: Collection2[]) => void): () => void {
  const q = query(
    collection(db, 'top-losers'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const losersData = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        top_losers: data.top_losers || [],
        timestamp: data.timestamp || '',
      };
    });

    if (typeof callback === 'function') {
      callback(losersData);
    }
  });

  return unsubscribe;
}

function GetMostTraded(callback: (stocks: Collection3[]) => void): () => void {
  const q = query(
    collection(db, "most-actively-traded"),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const stocksData = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        most_actively_traded: data.most_actively_traded || [],
        timestamp: data.timestamp || "",
      };
    });

    if (typeof callback === "function") {
      callback(stocksData);
    }
  });

  return unsubscribe;
}

const BubbleChart = () => {
  const [topGainers, setTopGainers] = useState<Collection[]>([]);
  const [topLosers, setTopLosers] = useState<Collection2[]>([]);
  const [mostActive, setMostActive] = useState<Collection3[]>([]);

  useEffect(() => {
    const unsubscribe = GetGainers((fetchedGainers) => {
      setTopGainers(fetchedGainers);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = GetLosers((fetchedLosers) => {
      setTopLosers(fetchedLosers);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = GetMostTraded((fetchedStocks) => {
      setMostActive(fetchedStocks);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const activelyTraded = mostActive.flatMap((stock) =>
    stock.most_actively_traded.map((s) => s.symbol)
  );


  const gainersData = topGainers.flatMap((gainer) =>
    gainer.top_gainers.slice(0, 10).map((stock) => ({
      x: parseFloat(stock.changesPercentage), 
      y: parseFloat(stock.change),          
      r: activelyTraded.includes(stock.symbol) ? 13 : 5,                                 
      stock: stock.symbol,                   
    }))
  );


  const losersData = topLosers.flatMap((loser) =>
    loser.top_losers.slice(0, 10).map((stock) => ({
      x: parseFloat(stock.changesPercentage), 
      y: parseFloat(stock.change),          
      r: activelyTraded.includes(stock.symbol) ? 13 : 5,                                 
      stock: stock.symbol,                   
    }))
  );

  const maxPercentage = topGainers.map((gainer) => 
    gainer.top_gainers.map((stock) => parseFloat(stock.changesPercentage) + 10)
  );

  const minPercentage = topLosers.map((loser) => 
    loser.top_losers.map((stock) => parseFloat(stock.changesPercentage) - 10)
  );

  const maxChange = topGainers.map((gainer) =>
    gainer.top_gainers.map((stock) => parseFloat(stock.change) + 10)
  );

  const minChange = topLosers.map((loser) =>
    loser.top_losers.map((stock) => parseFloat(stock.change) - 10)
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
        data: losersData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const { x, y } = context.raw;
            const stock = context.raw.stock;
            return [`Stock: ${stock}`, `Changes Percentage: ${x}%`, `Price Change: $${y}`]; 
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.01,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy' as 'xy',
         
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Changes Percentage (%)',
        },
        min: Math.min(...minPercentage.flat()),
        max: Math.max(...maxPercentage.flat()),
      },
      y: {
        title: {
          display: true,
          text: 'Price Change ($)',
        },
        min: Math.min(...minChange.flat()),
        max: Math.max(...maxChange.flat()),
      },
    },
    onHover: (event: any, chartElement: any) => {
      event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    },
    onClick: (_event: any, chartElement: any) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        const datasetIndex = chartElement[0].datasetIndex;
        const stock = data.datasets[datasetIndex].data[index] as any;
        const url = `https://stock-market-summary-server-b48b85a337b0.herokuapp.com/${stock.stock}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data); 
            window.location.href = `/${stock.stock}`;
          })
          .catch(error => console.error('Error:', error));
      }
    },
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <p>Larger Circles = Daily Most Actively Traded</p>
      <Bubble data={data} options={options} />
    </div>
  );
};

export default BubbleChart;
