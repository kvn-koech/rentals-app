import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error', null

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API_URL}/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      // Hardcoded customer ID for MVP
      const payload = {
        property_id: property.id,
        customer_id: 2, // customer_alice id from our seeded db
        start_date: startDate,
        end_date: endDate
      };
      await axios.post(`${API_URL}/bookings`, payload);
      setBookingStatus('success');
      setStartDate('');
      setEndDate('');
      // Optionally redirect or show success message for a few seconds
      setTimeout(() => setBookingStatus(null), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingStatus('error');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2>Loading property details...</h2></div>;
  if (!property) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2>Property not found.</h2></div>;

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1.5rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'white' }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Left Col: Image & Details */}
        <div>
          <img 
            src={property.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt={property.title} 
            style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem', objectFit: 'cover', height: '400px' }}
          />
          <h2>{property.title}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p className="property-location" style={{ fontSize: '1.1rem', margin: 0 }}><span>📍</span> {property.location}</p>
            <p className="property-price" style={{ margin: 0 }}>${property.price.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ month</span></p>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.6)' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Book This Property</h3>
          
          {bookingStatus === 'success' && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
              Booking successful! The landlord will contact you soon.
            </div>
          )}
          {bookingStatus === 'error' && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
              Error processing your booking. Please try again.
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label className="form-label">Check-in Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Check-out Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Request to Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
