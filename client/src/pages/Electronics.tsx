import React, { useEffect, useState } from 'react';
import { addDevice, getAllDevices, deleteDevice } from '../services/api';
import type { Electronics as ElectronicsType } from '../types';

const Electronics: React.FC = () => {
  const [devices, setDevices] = useState<ElectronicsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    deviceName: '',
    deviceType: 'laptop',
    powerConsumption: '',
    hoursPerDay: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await getAllDevices();
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addDevice({
        ...formData,
        powerConsumption: Number(formData.powerConsumption),
        hoursPerDay: Number(formData.hoursPerDay),
      });
      setFormData({
        deviceName: '',
        deviceType: 'laptop',
        powerConsumption: '',
        hoursPerDay: '',
        purchaseDate: new Date().toISOString().split('T')[0],
      });
      fetchDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deleteDevice(id);
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  const getDeviceIcon = (type: string) => {
    const icons: Record<string, string> = {
      laptop: '💻',
      desktop: '🖥️',
      phone: '📱',
      tablet: '📱',
      monitor: '🖥️',
      tv: '📺',
      other: '🔌',
    };
    return icons[type] || '🔌';
  };

  return (
    <div className="page">
      <h1 className="page-title">Electronics Tracker</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Add New Device</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Device Name</label>
            <input
              type="text"
              value={formData.deviceName}
              onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
              placeholder="e.g., MacBook Pro"
              required
            />
          </div>

          <div className="form-group">
            <label>Device Type</label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
            >
              <option value="laptop">💻 Laptop</option>
              <option value="desktop">🖥️ Desktop</option>
              <option value="phone">📱 Phone</option>
              <option value="tablet">📱 Tablet</option>
              <option value="monitor">🖥️ Monitor</option>
              <option value="tv">📺 TV</option>
              <option value="other">🔌 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Power Consumption (Watts)</label>
            <input
              type="number"
              value={formData.powerConsumption}
              onChange={(e) => setFormData({ ...formData, powerConsumption: e.target.value })}
              placeholder="e.g., 65"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Hours Used Per Day</label>
            <input
              type="number"
              value={formData.hoursPerDay}
              onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
              placeholder="e.g., 8"
              min="0"
              max="24"
              step="0.5"
              required
            />
          </div>

          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Device'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>My Devices</h2>
        {loading ? (
          <div className="loading">Loading devices...</div>
        ) : devices.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No devices yet. Add your first device above!</p>
        ) : (
          <ul className="list">
            {devices.map((device) => (
              <li key={device._id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">
                    {getDeviceIcon(device.deviceType)} {device.deviceName}
                  </div>
                  <div className="list-item-details">
                    {device.powerConsumption}W • {device.hoursPerDay}h/day • 
                    {device.usageEmissions.toFixed(3)} kg CO₂/day • 
                    Manufacturing: {device.manufacturingEmissions} kg CO₂
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(device._id)}
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

export default Electronics;
