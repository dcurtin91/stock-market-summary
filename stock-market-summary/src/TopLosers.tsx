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
    top_losers: Array<{
        symbol: string;
        price: string;
        change: string;
        changesPercentage: string;
        name: string;
    }>;
};


function GetLosers(callback: (losers: Collection[]) => void): () => void {
    const q = query(
        collection(db, "top-losers"),
        orderBy("timestamp", "desc"),
        limit(1)
    );


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const losersData = querySnapshot.docs.map((x) => {
            const data = x.data();
            return {
                id: x.id,
                top_losers: data.top_losers || [],
                timestamp: data.timestamp || "",
            };
        });

        if (typeof callback === "function") {
            callback(losersData);
        }
    });


    return unsubscribe;
}



function TopLosers() {
    const [topLosers, setTopLosers] = useState<Collection[]>([]);


    useEffect(() => {
        const unsubscribe = GetLosers((fetchedLosers) => {
            setTopLosers(fetchedLosers);
        });

        return () => {
            unsubscribe();
        }
    }, []);

    const loserRedirect = (symbol: string) => {
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
            {topLosers.map((item) => (
                <div key={item.id}>

                    {Array.isArray(item.top_losers) && item.top_losers.length > 0 ? (
                        <div className="table_grid">
                            {item.top_losers.slice(0, 10).map((stock, index) => (
                                <div key={index} className="table_data">
                                    <p className="stock_link"><a onClick={() => loserRedirect(stock.symbol)} target="_blank" rel="noopener noreferrer">{stock.name}</a></p>
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

export default TopLosers;


