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
  [key: string]: any; // Adjust based on actual fields in the summaries collection
};

type FirebaseCallback = (summaries: Summary[]) => void;



function GetSummaries(callback: FirebaseCallback) {
  return onSnapshot(collection(db, "summaries"), (querySnapshot) => {
    const summaries = querySnapshot.docs.map((x) => ({
      id: x.id,
      ...x.data(),
    }));

    if (typeof callback === "function") {
      callback(summaries);
    }
  });
}

export default GetSummaries;