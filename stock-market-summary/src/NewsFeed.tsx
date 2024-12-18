import { useEffect, useState } from 'react';
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
  analysis: string;
};

function GetAnalysis(callback: (analyses: Collection[]) => void): () => void {
  const q = query(
    collection(db, "ai"),
    orderBy("timestamp", "desc"),
    limit(1)
  );


  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const collection = querySnapshot.docs.map((x) => {
      const data = x.data();
      return {
        id: x.id,
        analysis: data.analysis || "",
      };
    });

    if (typeof callback === "function") {
      callback(collection);
    };

  });

  return unsubscribe;
};



function NewsFeed() {
  const[analyses, setAnalyses] = useState<Collection[]>([]);

  useEffect(() => {
    const unsubscribe = GetAnalysis((analyses) => {
      setAnalyses(analyses);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <div className='container'>
      <h2>Recent News</h2>
      <div>
        {analyses.map((item) => (
          <div key={item.id}>
            <p>{item.analysis}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;


