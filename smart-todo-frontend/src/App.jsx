import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* We will build these pages in the next steps */}
          <Route path="/" element={<h2>Home / Dashboard</h2>} />
          <Route path="/login" element={<h2>Login Page</h2>} />
          <Route path="/register" element={<h2>Register Page</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;