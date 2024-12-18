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


function GetArticles(callback: (articles: Collection[]) => void): () => void {
  const q = query(
    collection(db, "articles"),
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


function RenderArticles() {
  const [articles, setArticles] = useState<Collection[]>([]);


  useEffect(() => {
    const unsubscribe = GetArticles((articles) => {
      setArticles(articles);
    });

    return () => {
      unsubscribe();
    }
  }, []);


  return (
    <div className="container">
      <h2>Recent Articles</h2>
      <div>
        {articles.map((item) => (
          <div key={item.id}>
            <h4></h4>
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
                      {Array.isArray(item.feed) && item.feed.length > 0 ? (
                        <div className="table_grid">
                          {item.feed.slice(0, 4).map((record, index) => (
                            <div key={index} className="table_data">
                                <a href={`${record.url}`}>{record.title}</a>
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
            
          </div>
        ))}
      </div>

    </div>
  );
}

export default RenderArticles;

