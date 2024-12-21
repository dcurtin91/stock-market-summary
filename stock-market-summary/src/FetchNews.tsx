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


function GetArticles(index: number, callback: (articles: Collection[]) => void): () => void {
  const q = query(
    collection(db, `articles-${index + 1}`),
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
  const { index } = useParams<{ index: string }>();
  const [articles, setArticles] = useState<Collection[]>([]);


  useEffect(() => {
    const unsubscribe = GetArticles(Number(index), (articles) => {
      setArticles(articles);
    });

    return () => {
      unsubscribe();
    }
  }, [index]);


  return (
    <div className="news_container">
      <div>
        <h4>Analysis:</h4>
        <div><AiSummary /></div><br></br><br></br>
        {articles.map((item) => (
          <div key={item.id}>
            <h4>Recent Relevant Articles</h4>
            {Array.isArray(item.feed) && item.feed.length > 0 ? (
              <div>
                {item.feed.map((record, index) => (
                  <div key={index}>
                    <a href={`${record.url}`} target="_blank">{record.title}</a><br></br><br></br>
                  </div>
                ))}
              </div>
            ) : (
              <p>No trading data available</p>
            )}
          </div>  
        ))}
      </div>
    </div >
  );
}

export default FetchNews;

