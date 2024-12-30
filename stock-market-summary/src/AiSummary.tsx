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
  analysis: {
    point_1: string;
    point_2: string;
    point_3: string;
  };
};

function GetAnalysis(index: number, callback: (analysis: Collection[]) => void): () => void {
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
        analysis: data.analysis || [],
      };
    });

    if (typeof callback === "function") {
      callback(collection);
    }
  });
  return unsubscribe;
};

function AiSummary() {
  const { index } = useParams<{ index: string }>();
  const [analysis, setAnalysis] = useState<Collection[]>([]);

   useEffect(() => {
      const unsubscribe = GetAnalysis(Number(index), (analysis) => {
        setAnalysis(analysis);
      });
  
      return () => {
        unsubscribe();
      }
    }, [index]);;


  return (
    <div className='container'>
      {analysis.map((item, index) => (
        <div key={index}>
          <p>{item.analysis?.point_1}</p>
          <p>{item.analysis?.point_2}</p>
          <p>{item.analysis?.point_3}</p>
        </div>
      ))}
    </div>
  );
};

export default AiSummary;



