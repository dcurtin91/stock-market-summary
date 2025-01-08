import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  authDomain: "stock-market-summarizer.firebaseapp.com",
  projectId: "stock-market-summarizer",
  storageBucket: "stock-market-summarizer.appspot.com",
  messagingSenderId: "219851290952",
  appId: "1:219851290952:web:bad6129a8901a5e4e61b7d",
  measurementId: "G-B9BJC82143",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


