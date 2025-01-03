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
  most_actively_traded: Array<{
    symbol: string;
    price: string;
    change: string;
    changesPercentage: string;
    name: string;
  }>;
};


function GetMostTraded(callback: (stocks: Collection[]) => void): () => void {
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



function MostActive() {
  const [mostActive, setMostActive] = useState<Collection[]>([]);


  useEffect(() => {
    const unsubscribe = GetMostTraded((fetchedStocks) => {
      setMostActive(fetchedStocks);
    });

    return () => {
      unsubscribe();
    }
  }, []);


  return (
    <div>
      {mostActive.map((item) => (
        <div key={item.id}>
          {Array.isArray(item.most_actively_traded) && item.most_actively_traded.length > 0 ? (
            <div className="table_grid">
              {item.most_actively_traded.slice(0, 10).map((stock, index) => (
                <div key={index} className="table_data">
                  <p><a href={`https://finance.yahoo.com/quote/${stock.symbol}`} target="_blank" rel="noopener noreferrer">{stock.name}</a></p>
                  <p>{stock.symbol}</p>
                  <p>Price: ${stock.price}</p>
                  <p>Change Percentage: {stock.changesPercentage}</p>
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

export default MostActive;


