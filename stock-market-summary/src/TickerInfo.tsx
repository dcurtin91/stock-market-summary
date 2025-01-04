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
  }>;
};

function GetEntry(index: number, callback: (info: Collection[]) => void): () => void {
  const q = query(
    collection(db, `ticker-info-${index + 1}`),
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
  const { index } = useParams<{ index: string }>();
  const [info, setInfo] = useState<Collection[]>([]);

   useEffect(() => {
      const unsubscribe = GetEntry(Number(index), (fetchedInfo) => {
        setInfo(fetchedInfo);
      });
  
      return () => {
        unsubscribe();
      }
    }, [index]);;


  return (
    <div className='ticker-info'>
      {info.map((item) => (
        <div key={item.id}>
          <h1>{item.companyName}</h1>
          <h2>{item.symbol}</h2>
          <h3>{item.sector}</h3>
         {item.description.length > 8 ? (
            <p>{item.description}</p>
          ) : (
            ''
          )}
        </div>
      ))}
     
    </div>
  );
};

export default TickerInfo;



