import { useEffect, useState } from 'react';



function Data() {
    
    const [summary, setSummary] = useState<string>('');
    const url = 'https://stock-market-summary-server-b48b85a337b0.herokuapp.com/summarize-market';

    useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const newSummary = data.summary;
            setSummary(newSummary);
        })
        .catch(error => {
            console.error("Error parsing response: ", error);
        });
    }, [url]);

    return (
        <div>
            {summary}
        </div>
    );

}

export default Data;

