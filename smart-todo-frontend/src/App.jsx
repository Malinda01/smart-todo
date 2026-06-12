import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';

import Login from './pages/Login';       // <-- MUST HAVE THIS
import Register from './pages/Register'; // <-- MUST HAVE THIS
import Dashboard from './pages/Dashboard';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* We'll add Register and Dashboard later */}
      </Routes>
    </Router>
  );
}

export default App;