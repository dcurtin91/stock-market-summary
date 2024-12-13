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


//const API_KEY = import.meta.env.VITE_API_KEY;


const firebaseConfig = {
  //apiKey: API_KEY,
  authDomain: "stock-market-summarizer.firebaseapp.com",
  projectId: "stock-market-summarizer",
  storageBucket: "stock-market-summarizer.appspot.com",
  messagingSenderId: "219851290952",
  appId: "1:219851290952:web:bad6129a8901a5e4e61b7d",
  measurementId: "G-B9BJC82143"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


type Summary = {
  id: string;
  last_updated: string;
  most_actively_traded: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  top_gainers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  top_losers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
};


function GetSummaries(callback: (summaries: Summary[]) => void): () => void {
  const q = query(
    collection(db, "summaries"),
    orderBy("timestamp", "desc"),
    limit(1)
  );


  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const summaries = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        last_updated: data.last_updated || "",
        //summary: data.summary || "", 
        most_actively_traded: data.most_actively_traded || [],
        top_gainers: data.top_gainers || [],
        top_losers: data.top_losers || [],
      };
    });

    if (typeof callback === "function") {
      callback(summaries);
    }
  });


  return unsubscribe;
}

function ConvertString(value: string) {
  return (
    parseFloat(value.replace("%", ""))
  );
}

function RenderSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([]);



  useEffect(() => {
    const unsubscribe = GetSummaries((summaries) => {
      setSummaries(summaries);
    });

    return () => {
      unsubscribe();
    }
  }, []);







  return (
    <div className="container">
      <h2>Stock Market Summary</h2>
      <div>
        {summaries.map((summary) => (
          <div key={summary.id}>
            <h4>{summary.last_updated}</h4>
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
                      {Array.isArray(summary.most_actively_traded) && summary.most_actively_traded.length > 0 ? (
                        <div className="table_grid">
                          {summary.most_actively_traded.slice(0, 4).map((stock, index) => (
                            <div key={index} className="table_data">
                              <p>
                              <a
                                  href="#"
                                  onClick={async () => {
                                    const response = await fetch(`http://localhost:3000/articles?ticker=${stock.ticker}`);
                                    const data = await response.json();
                                    console.log(data); // Handle the response as needed
                                  }}
                                >
                                  {stock.ticker}
                                </a>
                              </p>
                              <p>
                                {ConvertString(stock.change_percentage) > 0 ? (
                                  <span className="up_arrow">⬆</span>
                                ) : (
                                  <span className="down_arrow">⬇</span>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No trading data available</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div className="table_div">
              <table>
                <thead>
                  <tr>
                    <th>Top Gainers</th>
                    <th></th>
                    <th>Top Losers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {Array.isArray(summary.top_gainers) && summary.top_gainers.length > 0
                        ? summary.top_gainers.map((gainer, index) => (
                          <div key={index} className="table_data">
                            <p><a href={`https://finance.yahoo.com/quote/${gainer.ticker}`} target="_blank" rel="noopener noreferrer">{gainer.ticker}</a></p>
                            <p>Price: ${gainer.price}</p>
                            <p>Volume: {gainer.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p>Change Percentage: {gainer.change_percentage}</p>
                            <p>Total Change Amount: ${gainer.change_amount.toLocaleString()}</p>
                          </div>
                        ))
                        : <p>No gainers available</p>}

                    </td>
                    <td></td>
                    <td>
                      {Array.isArray(summary.top_losers) && summary.top_losers.length > 0
                        ? summary.top_losers.map((loser, index) => (
                          <div key={index} className="table_data">
                            <p><a href={`https://finance.yahoo.com/quote/${loser.ticker}`} target="_blank" rel="noopener noreferrer">{loser.ticker}</a></p>
                            <p>Price: ${loser.price}</p>
                            <p>Volume: {loser.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p>Change Percentage: {loser.change_percentage}</p>
                            <p>Total Change Amount: <span className="negativeCurr">{loser.change_amount.toString().replace(/-/g, "")}</span></p>
                          </div>
                        ))
                        : <p>No losers available</p>}
                    </td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RenderSummaries;


{/* <h2>Summary:</h2>
<p>{summary.summary}</p> */}