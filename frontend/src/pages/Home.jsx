import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_URL}/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2>Loading amazing properties...</h2></div>;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Discover Your Next Dream Home</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Explore our exclusive collection of premium properties available for rent.
        </p>
      </div>

      <div className="property-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card glass-panel">
            <img 
              src={property.image_url || 'https://via.placeholder.com/500x300?text=No+Image'} 
              alt={property.title} 
              className="property-image"
            />
            <div className="property-content">
              <h3 className="property-title">{property.title}</h3>
              <div className="property-location">
                <span>📍</span> {property.location}
              </div>
              <div className="property-price">${property.price.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ month</span></div>
              <Link to={`/property/${property.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                View Details
              </Link>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No properties available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
