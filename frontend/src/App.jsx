import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import LandlordDashboard from './pages/LandlordDashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <span style={{ fontSize: '1.8rem' }}>🏠</span> LuxeRentals
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/landlord" className="nav-link">Landlord Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/landlord" element={<LandlordDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
