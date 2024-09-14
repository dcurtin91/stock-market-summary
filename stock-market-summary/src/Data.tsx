import { useEffect, useState } from 'react';

interface Gainer {
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
}

function Data() {
    
    const [gainers, setGainers] = useState<Gainer[]>([]);
    const url = 'https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo';

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const topGainers = data.top_gainers;
            setGainers(topGainers);
        })
        .catch(error => {
            console.error("Error parsing response: ", error);
        });
    }, [url]);

    return (
        <div>
            {gainers.map((gainer, index) => (
                <li key={index}>
                    <strong>{gainer.ticker}: ${gainer.price} ({gainer.change_percentage} change)</strong>
                </li>
            ))}
        </div>
    );

}

export default Data;

