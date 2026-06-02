import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';
const LANDLORD_ID = 1; // Hardcoded for MVP

function LandlordDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New property form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState(null);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/landlord/${LANDLORD_ID}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        location,
        image_url: imageUrl,
        landlord_id: LANDLORD_ID
      };
      await axios.post(`${API_URL}/properties`, payload);
      setFormStatus('success');
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setImageUrl('');
      // Refresh properties
      fetchProperties();
      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      console.error('Error adding property:', error);
      setFormStatus('error');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2>Loading dashboard...</h2></div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1>Landlord Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Manage your property listings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Col: Add Property Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Property</h3>
          
          {formStatus === 'success' && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderRadius: '8px', marginBottom: '1.5rem' }}>
              Property added successfully!
            </div>
          )}
          {formStatus === 'error' && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.5rem' }}>
              Error adding property. Please try again.
            </div>
          )}

          <form onSubmit={handleAddProperty}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price per Month ($)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL (Optional)</label>
              <input type="url" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              List Property
            </button>
          </form>
        </div>

        {/* Right Col: Existing Properties */}
        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>Your Current Listings</h3>
          {properties.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              You don't have any properties listed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {properties.map(property => (
                <div key={property.id} className="glass-panel" style={{ display: 'flex', overflow: 'hidden' }}>
                  <img 
                    src={property.image_url || 'https://via.placeholder.com/150x150?text=No+Image'} 
                    alt={property.title} 
                    style={{ width: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{property.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><span>📍</span> {property.location}</p>
                    <p style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>${property.price.toLocaleString()} / mo</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LandlordDashboard;
