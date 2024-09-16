import { useEffect, useState } from 'react';


interface Summary {
    summary: string;
    sectors: string;
    top_gainers: Gainer[];
    top_losers: Loser[];
}

interface Gainer {
    ticker: string;
    price: string;
    change_percent: string;
}

interface Loser {
    ticker: string;
    price: string;
    change_percent: string;
}



function Data() {
    
    const [stockData, setStockData] = useState<Summary | null>(null);
    

    const url = 'https://stock-market-summary-server-b48b85a337b0.herokuapp.com/summarize-market';

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const parsedSummary = JSON.parse(data.summary);
            setStockData(parsedSummary);
            
        })
        .catch(error => {
            console.error("Error parsing response: ", error);
        });
    }, [url]);

    if (!stockData) {
        return <>Loading...</>;
    }

    return (
        <div>
           <h2>Today's Summary</h2>
           <p>{stockData.summary}</p>
           <h3>Notable Sector Performances</h3>
           <p>{stockData.sectors}</p>

           <h3>Top Gainers</h3>
            <ul>
                {stockData.top_gainers?.length ? (
                    stockData.top_gainers.map((gainer, index) => (
                        <li key={index}>
                            <strong>{gainer.ticker}</strong>: ${gainer.price} ({gainer.change_percent} change)
                        </li>
                    ))
                ) : (
                    <li>No top gainers available.</li>
                )}
            </ul>

            <h3>Top Losers</h3>
            <ul>
                {stockData.top_losers?.length ? (
                    stockData.top_losers.map((loser, index) => (
                        <li key={index}>
                            <strong>{loser.ticker}</strong>: ${loser.price} ({loser.change_percent} change)
                        </li>
                    ))
                ) : (
                    <li>No top losers available.</li>
                )}
            </ul>
        </div>
    );

}

export default Data;

