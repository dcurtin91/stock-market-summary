import React, { useEffect, useState } from 'react';

interface Topic {
  topic: string;
  relevance_score: string;
}

interface TickerSentiment {
  ticker: string;
  relevance_score: string;
  ticker_sentiment_score: string;
  ticker_sentiment_label: string;
}

interface FeedItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Topic[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: TickerSentiment[];
}

interface Data {
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: FeedItem[];
}

const NewsFeed: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: Data = await response.json();
        setData(result);
      } catch (err: any) {
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
      <p><strong>Items:</strong> {data.items}</p>
      <p><strong>Sentiment Score Definition:</strong> {data.sentiment_score_definition}</p>
      <p><strong>Relevance Score Definition:</strong> {data.relevance_score_definition}</p>

      {data.feed.map((item, index) => (
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

export default NewsFeed;
