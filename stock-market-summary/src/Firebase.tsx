import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot
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


type Summary = {
  id: string;
  summary: string;
  sectors: string;
  top_gainers: string;
  top_losers: string;
};

function GetSummaries(callback: (summaries: Summary[]) => void): () => void {
  const unsubscribe = onSnapshot(collection(db, "summaries"), (querySnapshot) => {
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
    <>
     <h1>Stock Market Summaries</h1>
      <ul>
        {summaries.map((summary) => (
          <li key={summary.id}>
            <h2>Summary:</h2>
            <p>{summary.summary}</p>
            <h3>Sectors:</h3>
            <p>{summary.sectors}</p>
            <h3>Top Gainers:</h3>
            <ul>
              {Array.isArray(summary.top_gainers) ? summary.top_gainers.map((gainer, index) => (
                <li key={index}>
                  <p>Ticker: {gainer.ticker}</p>
                  <p>Price: {gainer.price}</p>
                  <p>Volume: {gainer.volume}</p>
                  <p>Change Percentage: {gainer.change_percentage}</p>
                  <p>Change Amount: {gainer.change_amount}</p>
                </li>
              )) : <p>No gainers available</p>}
            </ul>

            <h3>Top Losers:</h3>
            <ul>
              {Array.isArray(summary.top_losers) ? summary.top_losers.map((loser, index) => (
                <li key={index}>
                  <p>Ticker: {loser.ticker}</p>
                  <p>Price: {loser.price}</p>
                  <p>Volume: {loser.volume}</p>
                  <p>Change Percentage: {loser.change_percentage}</p>
                  <p>Change Amount: {loser.change_amount}</p>
                </li>
              )) : <p>No losers available</p>}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );

  
}

export default RenderSummaries;