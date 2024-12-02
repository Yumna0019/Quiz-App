import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from './components/Settings';
import Questions from './components/Questions';

function App() {
  return (
    <div id="App">
      <Router>
        <Routes>
          <Route path="/" element={<Settings/>}></Route>
          <Route path="/question" element={<Questions/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
