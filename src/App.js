import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PainterPage from './pages/PainterPage';
import CustomerPage from './pages/CustomerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="main-nav">
          <Link to="/painter" className="nav-link">🎨 Painter</Link>
          <Link to="/customer" className="nav-link">👤 Customer</Link>
        </nav>
        <Routes>
          <Route path="/painter" element={<PainterPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/" element={
            <div className="welcome">
              <h1>Welcome!</h1>
              <p>Select your role to continue.</p>
              <div className="role-buttons">
                <Link to="/painter">
                  <button className="role-btn">Go to Painter Page</button>
                </Link>
                <Link to="/customer">
                  <button className="role-btn">Go to Customer Page</button>
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
