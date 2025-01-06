import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  onSnapshot,
  query
} from "firebase/firestore";


const firebaseConfig = {
  authDomain: "stock-market-summarizer.firebaseapp.com",
  projectId: "stock-market-summarizer",
  storageBucket: "stock-market-summarizer.appspot.com",
  messagingSenderId: "219851290952",
  appId: "1:219851290952:web:bad6129a8901a5e4e61b7d",
  measurementId: "G-B9BJC82143"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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


  return (
    <div>
      {topGainers.map((item) => (
        <div key={item.id}>
          {Array.isArray(item.top_gainers) && item.top_gainers.length > 0 ? (
            <div className="table_grid">
              {item.top_gainers.slice(0, 10).map((stock, index) => (
                <div key={index} className="table_data">
                  <p><a href={`https://finance.yahoo.com/quote/${stock.symbol}`} target="_blank" rel="noopener noreferrer">{stock.name}</a></p>
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


