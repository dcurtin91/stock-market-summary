import React, { useEffect, useState } from 'react';


function FetchNews() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles?ticker=AAPL');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="news-feed">
      <h1>News Feed</h1>
      <p><strong>Item:</strong> {data.data.items}</p>
      <p><strong>Sentiment Score Definition:</strong> {data.data.sentiment_score_definition}</p>
      <p><strong>Relevance Score Definition:</strong> {data.relevance_score_definition}</p>

      {data.feed && data.feed.map((item, index) => (
        <div key={index} className="news-item">
          <h2><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h2>
          <img src={item.banner_image} alt="Banner" className="banner-image" />
          <p><strong>Published:</strong> {new Date(item.time_published).toLocaleString()}</p>
          <p><strong>Authors:</strong> {item.authors.join(', ')}</p>
          <p><strong>Summary:</strong> {item.summary}</p>
          <p><strong>Source:</strong> {item.source} ({item.source_domain})</p>
          <p><strong>Category:</strong> {item.category_within_source || 'N/A'}</p>
          <p><strong>Overall Sentiment:</strong> {item.overall_sentiment_label} ({item.overall_sentiment_score})</p>

          <div className="topics">
            <h3>Topics</h3>
            <ul>
              {item.topics.map((topic, idx) => (
                <li key={idx}>{topic.topic} (Relevance: {topic.relevance_score})</li>
              ))}
            </ul>
          </div>

          <div className="ticker-sentiment">
            <h3>Ticker Sentiment</h3>
            <ul>
              {item.ticker_sentiment.map((ticker, idx) => (
                <li key={idx}>
                  {ticker.ticker} - {ticker.ticker_sentiment_label} (Score: {ticker.ticker_sentiment_score}, Relevance: {ticker.relevance_score})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchNews;


