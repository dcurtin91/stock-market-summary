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


const API_KEY = import.meta.env.VITE_API_KEY;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "stock-market-summarizer.firebaseapp.com",
  projectId: "stock-market-summarizer",
  storageBucket: "stock-market-summarizer.appspot.com",
  messagingSenderId: "219851290952",
  appId: "1:219851290952:web:bad6129a8901a5e4e61b7d",
  measurementId: "G-B9BJC82143"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// const date = new Date();
// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();
// let currentDate = `${year}-${month}-${day}`;

type Summary = {
  id: string;
  summary: string;
  sectors: string;
  top_gainers: string;
  top_losers: string;
};

function GetSummaries(callback: (summaries: Summary[]) => void): () => void {
  const q = query(
    collection(db, "summaries"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  console.log(q);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const summaries = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        summary: data.summary || "", 
        sectors: data.sectors || "",
        top_gainers: data.top_gainers || "",
        top_losers: data.top_losers || "",
      };
    });

    if (typeof callback === "function") {
      callback(summaries);
    }
  });

  
  return unsubscribe;
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
      <h1>Stock Market Summaries</h1>
      
      <div>
        {summaries.map((summary) => (
          <div key={summary.id}>
            <h3>Last update: {summary.id} at 4pm ET</h3>
            <h2>Summary:</h2>
            <p>{summary.summary}</p>
            <h3>Sectors:</h3>
            <p>{summary.sectors}</p>
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
                      <p>Ticker: <a href={`https://finance.yahoo.com/quote/${gainer.ticker}`} target="_blank" rel="noopener noreferrer">{gainer.ticker}</a></p>
                      <p>Price: ${gainer.price}</p>
                      <p>Volume: {gainer.volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                      <p>Change Percentage: {gainer.change_percentage}</p>
                      <p>Total Change Amount: ${gainer.change_amount.toLocaleString('en')}</p>
                    </div>
                  ))
                : <p>No gainers available</p>}
                  </td>
                  <td></td>
                  <td>
                  {Array.isArray(summary.top_losers) && summary.top_losers.length > 0
                ? summary.top_losers.map((loser, index) => (
                    <div key={index} className="table_data">
                      <p>Ticker: <a href={`https://finance.yahoo.com/quote/${loser.ticker}`} target="_blank" rel="noopener noreferrer">{loser.ticker}</a></p>
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
