import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderSummaries from './Firebase';
import NewsFeed from "./NewsFeed";
import './App.css'

  const App: React.FC = () => {
    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<RenderSummaries />} />
            <Route path="/news1" element={<NewsFeed />} />
          </Routes>
        </Router>
      </div>
    );
  };

export default App
