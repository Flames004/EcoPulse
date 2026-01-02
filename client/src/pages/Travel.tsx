import React, { useEffect, useState } from 'react';
import { addTravel, getAllTravels, deleteTravel } from '../services/api';
import type { Travel as TravelType } from '../types';

const Travel: React.FC = () => {
  const [travels, setTravels] = useState<TravelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    transportMode: 'car',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      setLoading(true);
      const response = await getAllTravels();
      setTravels(response.data);
    } catch (error) {
      console.error('Error fetching travels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addTravel(formData);
      setFormData({
        origin: '',
        destination: '',
        transportMode: 'car',
        date: new Date().toISOString().split('T')[0],
      });
      fetchTravels();
    } catch (error) {
      console.error('Error adding travel:', error);
      alert('Failed to add travel. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this travel entry?')) {
      try {
        await deleteTravel(id);
        fetchTravels();
      } catch (error) {
        console.error('Error deleting travel:', error);
      }
    }
  };

  const getTransportIcon = (mode: string) => {
    const icons: Record<string, string> = {
      car: '🚗',
      bus: '🚌',
      train: '🚆',
      flight: '✈️',
    };
    return icons[mode] || '🚗';
  };

  return (
    <div className="page">
      <h1 className="page-title">Travel Tracker</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Add New Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Origin</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="e.g., New York, NY"
              required
            />
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Boston, MA"
              required
            />
          </div>

          <div className="form-group">
            <label>Transport Mode</label>
            <select
              value={formData.transportMode}
              onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
            >
              <option value="car">🚗 Car</option>
              <option value="bus">🚌 Bus</option>
              <option value="train">🚆 Train</option>
              <option value="flight">✈️ Flight</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Trip'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Travel History</h2>
        {loading ? (
          <div className="loading">Loading travels...</div>
        ) : travels.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No travel entries yet. Add your first trip above!</p>
        ) : (
          <ul className="list">
            {travels.map((travel) => (
              <li key={travel._id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">
                    {getTransportIcon(travel.transportMode)} {travel.origin} → {travel.destination}
                  </div>
                  <div className="list-item-details">
                    {travel.distance.toFixed(2)} km • {travel.emissions.toFixed(2)} kg CO₂ • 
                    {new Date(travel.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(travel._id)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Travel;
