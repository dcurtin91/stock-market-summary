import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderSummaries from './Firebase';
import FetchNewsSentiment from "./FetchNewsSentiment";
import './App.css'

  const App: React.FC = () => {
    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<RenderSummaries />} />
            <Route path="/articles" element={<FetchNewsSentiment />} />
          </Routes>
        </Router>
      </div>
    );
  };

export default App
