import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Alerts from './Alerts';
import State from './State';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/alerts" style={{ marginRight: '1rem' }}>Alerts</Link>
        <Link to="/state">Current State</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/state" element={<State />} />
      </Routes>
    </Router>
  );
}

export default App;
