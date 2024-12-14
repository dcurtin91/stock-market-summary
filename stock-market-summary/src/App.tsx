import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderSummaries from './Firebase';
//import NewsFeed from './FetchNewsSentiment.js';
import FetchNews from './FetchNews.jsx';
import './App.css'

  const App: React.FC = () => {
    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<RenderSummaries />} />
            <Route path="/articles" element={<FetchNews />} />
          </Routes>
        </Router>
      </div>
    );
  };

export default App
