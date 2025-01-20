import { useParams } from 'react-router-dom';
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
import AiSummary from "./AiSummary";
import TickerInfo from './TickerInfo';


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
  feed: Array<{
    title: string;
    url: string;
  }>;
};


function GetArticles(ticker: string, callback: (articles: Collection[]) => void): () => void {
  const q = query(
    collection(db, `${ticker}`),
    orderBy("timestamp", "desc"),
    limit(1)
  );


  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const collection = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        feed: data.feed || [],
      };
    });

    if (typeof callback === "function") {
      callback(collection);
    }
  });


  return unsubscribe;
}


function FetchNews() {
  const { ticker } = useParams<{ ticker: string }>();
  const [articles, setArticles] = useState<Collection[]>([]);


  useEffect(() => {
    const unsubscribe = GetArticles(String(ticker), (articles) => {
      setArticles(articles);
    });

    return () => {
      unsubscribe();
    }
  }, [ticker]);


  return (
    <div className="news_container">
      <div className='back_button'><a href="/" className='back_button_link'>← Back</a></div>
      <div>
        <div><TickerInfo /></div>
        
        {articles.map((item) => (
          <div key={item.id}>
            {Array.isArray(item.feed) && item.feed.length > 0 ? (
              <div><AiSummary /></div>
            ) : (
              ''
            )}
            {Array.isArray(item.feed) && item.feed.length > 0 ? (
              <div className='table_data'>
                {item.feed.map((record, index) => (
                  <div key={index}>
                    <a href={`${record.url}`} target="_blank">{record.title}</a><br></br><br></br>
                  </div>
                ))}
              </div>
            ) : (
              ''
            )}
          </div>  
        ))}
      </div>
    </div >
  );
}

export default FetchNews;

