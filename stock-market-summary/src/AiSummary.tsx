import { useParams } from 'react-router-dom';
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

function GetAnalysis(index: number, callback: (analyses: Collection[]) => void): () => void {
  console.log(index);
  const q = query(
    collection(db, `ai-${index + 1}`),
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

function AiSummary() {
  const { index } = useParams<{ index: string }>();
  const [analyses, setAnalyses] = useState<Collection[]>([]);

  useEffect(() => {
    const unsubscribe = GetAnalysis(Number(index), (analyses) => {
      setAnalyses(analyses);
    });

    return () => {
      unsubscribe();
    };
  }, [index]);

  return (
    <div className='container'>
        {analyses.map((item) => (
          <div key={item.id}>
            <p>{item.analysis}</p>
          </div>
        ))}
    </div>
  );
};

export default AiSummary;


