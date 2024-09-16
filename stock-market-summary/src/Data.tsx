import { useEffect, useState } from 'react';


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
    
    const [summary, setSummary] = useState<string>('');
    const [sectors, setSectors] = useState<string>('');
    const [topGainers, setTopGainers] = useState<Gainer[]>([]);
    const [topLosers, setTopLosers] = useState<Loser[]>([]);

    const url = 'https://stock-market-summary-server-b48b85a337b0.herokuapp.com/summarize-market';

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const dataSummary = data.summary;
            const dataSectors = data.sectors;
            const dataTopGainers = data.top_gainers;
            const dataTopLosers = data.top_losers;
            setSummary(dataSummary);
            setSectors(dataSectors);
            setTopGainers(dataTopGainers);
            setTopLosers(dataTopLosers);
        })
        .catch(error => {
            console.error("Error parsing response: ", error);
        });
    }, [url]);

    if (!summary) {
        return <>Loading...</>;
    }

    return (
        <div>
           <h2>Today's Summary</h2>
           <p>{summary}</p>
           <h3>Notable Sector Performances</h3>
           <p>{sectors}</p>

           <h3>Top Gainers</h3>
            <ul>
                {topGainers?.length ? (
                    topGainers.map((gainer, index) => (
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
                {topLosers?.length ? (
                    topLosers.map((loser, index) => (
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

