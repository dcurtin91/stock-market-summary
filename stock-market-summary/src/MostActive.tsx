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

function ConvertString(value: string) {
  return (
    parseFloat(value)
  );
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
          <div className="table_div">
              <table>
                <thead>
                  <tr>
                    <th>Most Actively Traded Stocks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {Array.isArray(item.most_actively_traded) && item.most_actively_traded.length > 0 ? (
                        <div className="table_grid">
                          {item.most_actively_traded.slice(0, 4).map((stock, index) => (
                            <div key={index} className="table_data">
                              <p>
                              <a
                                  href={`/news/${index}`}
                                  
                                >
                                  {stock.name}
                                </a>
                              </p>
                              <p>{stock.symbol}</p>
                              <p>${stock.price}</p>
                              <p>
                                {ConvertString(stock.change) > 0 ? (
                                  <span className="up_arrow">⬆</span>
                                ) : (
                                  <span className="down_arrow">⬇</span>
                                )}
                              </p>
                              <p>{stock.changesPercentage}%</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Missing Data</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
        </div>
      ))}
    </div>
  );
}

export default MostActive;


