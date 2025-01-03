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
    timestamp: string;
    top_losers: Array<{
        symbol: string;
        price: string;
        change: string;
        changesPercentage: string;
        name: string;
    }>;
};


function GetLosers(callback: (losers: Collection[]) => void): () => void {
    const q = query(
        collection(db, "top-losers"),
        orderBy("timestamp", "desc"),
        limit(1)
    );


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const losersData = querySnapshot.docs.map((x) => {
            const data = x.data();
            return {
                id: x.id,
                top_losers: data.top_losers || [],
                timestamp: data.timestamp || "",
            };
        });

        if (typeof callback === "function") {
            callback(losersData);
        }
    });


    return unsubscribe;
}



function TopLosers() {
    const [topLosers, setTopLosers] = useState<Collection[]>([]);


    useEffect(() => {
        const unsubscribe = GetLosers((fetchedLosers) => {
            setTopLosers(fetchedLosers);
        });

        return () => {
            unsubscribe();
        }
    }, []);


    return (
        <div>
            {topLosers.map((item) => (
                <div key={item.id}>

                    {Array.isArray(item.top_losers) && item.top_losers.length > 0 ? (
                        <div className="table_grid">
                            {item.top_losers.slice(0, 10).map((stock, index) => (
                                <div key={index} className="table_data">
                                    <p><a href={`https://finance.yahoo.com/quote/${stock.symbol}`} target="_blank" rel="noopener noreferrer">{stock.name}</a></p>
                                    <p>{stock.symbol}</p>
                                    <p>Price: ${stock.price}</p>
                                    <p>Change Percentage: {stock.changesPercentage}</p>
                                    <p>Total Change Amount: ${stock.change.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Missing Data</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default TopLosers;


