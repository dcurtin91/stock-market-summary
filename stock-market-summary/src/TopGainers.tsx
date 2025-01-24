import { useState, useEffect } from "react";
import { db } from "./Firebase";
import {
  collection,
  orderBy,
  limit,
  onSnapshot,
  query
} from "firebase/firestore";


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
    collection(db, "top-gainers"),
    orderBy("timestamp", "desc"),
    limit(1)
  );


  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const gainersData = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        top_gainers: data.top_gainers || [],
        timestamp: data.timestamp || "",
      };
    });

    if (typeof callback === "function") {
      callback(gainersData);
    }
  });


  return unsubscribe;
}


function TopGainers() {
  const [topGainers, setTopGainers] = useState<Collection[]>([]);


  useEffect(() => {
    const unsubscribe = GetGainers((fetchedGainers) => {
      setTopGainers(fetchedGainers);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  const gainerRedirect = (symbol: string) => {
    const url = `https://stock-market-summary-server-b48b85a337b0.herokuapp.com/${symbol}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data); 
            window.location.href = `/${symbol}`;
          })
          .catch(error => console.error('Error:', error));
  };


  return (
    <div>
      {topGainers.map((item) => (
        <div key={item.id}>
          {Array.isArray(item.top_gainers) && item.top_gainers.length > 0 ? (
            <div className="table_grid">
              {item.top_gainers.slice(0, 10).map((stock, index) => (
                <div key={index} className="table_data">
                  <p className="stock_link"><a onClick={() => gainerRedirect(stock.symbol)}>{stock.name}</a></p>
                  <p>{stock.symbol}</p>
                  <p>Price: ${stock.price}</p>
                  <p>Change Percentage: {stock.changesPercentage}%</p>
                  <p>Total Change Amount: ${stock.change.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Missing Data</p>
          )}
        </div>
      ))}
    
    </div>
  );
}

export default TopGainers;


