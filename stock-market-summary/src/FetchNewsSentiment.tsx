import  { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  orderBy,
  limit,
  onSnapshot,
  query,
} from "firebase/firestore";

const API_KEY = import.meta.env.VITE_API_KEY;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "stock-market-summarizer.firebaseapp.com",
  projectId: "stock-market-summarizer",
  storageBucket: "stock-market-summarizer.appspot.com",
  messagingSenderId: "219851290952",
  appId: "1:219851290952:web:bad6129a8901a5e4e61b7d",
  measurementId: "G-B9BJC82143",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type StockNews = {
  ticker: string;
  headlines: Array<{ title: string; url: string }>;
};

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



function RenderSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [newsData, setNewsData] = useState<Record<string, StockNews>>({});
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    const unsubscribe = GetSummaries((summaries) => {
      setSummaries(summaries);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchNewsSentiment = async (ticker: string) => {
    setLoadingNews(true);
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${API_KEY}`
      );
      const data = await response.json();
      if (data.feed) {
        setNewsData((prev) => ({
          ...prev,
          [ticker]: {
            ticker,
            headlines: data.feed.map((item: any) => ({
              title: item.title,
              url: item.url,
            })),
          },
        }));
      }
    } catch (error) {
      console.error(`Error fetching news for ${ticker}:`, error);
    } finally {
      setLoadingNews(false);
    }
  };

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
                      {Array.isArray(summary.most_actively_traded) &&
                      summary.most_actively_traded.length > 0 ? (
                        <div className="table_grid">
                          {summary.most_actively_traded.slice(0, 4).map(
                            (stock, index) => (
                              <div key={index} className="table_data">
                                <p>
                                  <button
                                    onClick={() =>
                                      fetchNewsSentiment(stock.ticker)
                                    }
                                  >
                                    Get News for {stock.ticker}
                                  </button>
                                </p>
                                {newsData[stock.ticker]?.headlines ? (
                                  <ul>
                                    {newsData[stock.ticker].headlines.map(
                                      (news, idx) => (
                                        <li key={idx}>
                                          <a
                                            href={news.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {news.title}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : loadingNews ? (
                                  <p>Loading news...</p>
                                ) : null}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p>No trading data available</p>
                      )}
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
