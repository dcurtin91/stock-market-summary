import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RenderSummaries from './Firebase';
import AiSummary from "./AiSummary";
import './App.css'

  const App: React.FC = () => {
    return (
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<RenderSummaries />} />
            <Route path="/news1" element={<AiSummary />} />
          </Routes>
        </Router>
      </div>
    );
  };

export default App
