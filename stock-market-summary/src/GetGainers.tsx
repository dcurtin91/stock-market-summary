import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase"; 

type Collection = {
  id: string;
  timestamp: string;
  top_gainers: Array<{
    symbol: string;
    price: string;
    change: string;
    changesPercentage: string;
    name: string;
  }>;
};

/**
 * Subscribes to the "top-gainers" Firestore collection and invokes a callback
 * with the fetched data.
 * @param callback - Function to handle fetched gainers data
 * @returns Unsubscribe function to stop listening to changes
 */
export function GetGainers(callback: (gainers: Collection[]) => void): () => void {
  const q = query(
    collection(db, "top-gainers"),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const gainersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        top_gainers: data.top_gainers || [],
        timestamp: data.timestamp || "",
      };
    });

    callback(gainersData);
  });

  return unsubscribe;
}
