import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderSummaries from "./RenderSummaries";
import FetchNews from "./FetchNews";
import './App.css'

  const App: React.FC = () => {
    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<RenderSummaries />} />
            <Route path="/news/:index" element={<FetchNews />} />
          </Routes>
        </Router>
      </div>
    );
  };

export default App
