import { useEffect, useState } from 'react';

interface StockData {
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
    
    const [stockData, setStockData] = useState<StockData | null>(null);
    const url = 'https://stock-market-summary-server-b48b85a337b0.herokuapp.com/summarize-market';

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setStockData(data);
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
                {stockData.top_gainers.map((gainer, index) => (
                    <li key={index}>
                        <strong>{gainer.ticker}</strong>: ${gainer.price} ({gainer.change_percent} change)
                    </li>
                ))}
            </ul>

            <h3>Top Losers</h3>
            <ul>
                {stockData.top_losers.map((loser, index) => (
                    <li key={index}>
                        <strong>{loser.ticker}</strong>: ${loser.price} ({loser.change_percent} change)
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Data;

