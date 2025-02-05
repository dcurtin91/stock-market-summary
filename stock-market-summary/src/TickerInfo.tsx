import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
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
  ticker_info: Array<{
  companyName: string;
  symbol: string;
  sector: string;
  description: string;
  exchangeShortName: string;
  }>;
};

function GetEntry(ticker: string, callback: (info: Collection[]) => void): () => void {
  const q = query(
    collection(db, `ticker-info-${ticker}`),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    console.log("Query Snapshot:", querySnapshot.docs);
    const tickerData = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        timestamp: data.timestamp || "",
        ticker_info: data.ticker_info || [],
      };
    });

    if (typeof callback === "function") {
      callback(tickerData);
    }
  });
  return unsubscribe;
};

function TickerInfo() {
  const { ticker } = useParams<{ ticker: string }>();
  const [info, setInfo] = useState<Collection[]>([]);

   useEffect(() => {
      const unsubscribe = GetEntry(String(ticker), (fetchedInfo) => {
        setInfo(fetchedInfo);
      });
  
      return () => {
        unsubscribe();
      }
    }, [ticker]);;


  return (
    <div className='ticker-info'>
      {info.map((item) => (
        <div key={item.id}>
          {item.ticker_info.map((ticker) => (
            <div key={ticker.symbol}>
              <h3>{ticker.companyName}</h3>
              <p>Ticker: {ticker.symbol}</p>
              <p>{ticker.exchangeShortName}</p>
              {ticker.sector ? <p>Sector: {ticker.sector}</p> : null}
              <p>{ticker.description}</p>
            </div>
          ))}
        </div>
      ))}
     
    </div>
  );
};

export default TickerInfo;



