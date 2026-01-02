import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/api';
import type { Recommendations as RecommendationsType } from '../types';

const Recommendations: React.FC = () => {
  const [data, setData] = useState<RecommendationsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await getRecommendations();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Generating AI recommendations...</div>;
  }

  if (!data) {
    return <div className="error">Failed to load recommendations</div>;
  }

  return (
    <div className="page">
      <h1 className="page-title">AI-Powered Recommendations</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Your Carbon Footprint Insights</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Emissions</div>
            <div className="stat-value">{data.insights.totalEmissions.toFixed(2)}</div>
            <div className="stat-label">kg CO₂</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Travel Emissions</div>
            <div className="stat-value">{data.insights.travelEmissions.toFixed(2)}</div>
            <div className="stat-label">kg CO₂</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Electronics Emissions</div>
            <div className="stat-value">{data.insights.electronicsEmissions.toFixed(2)}</div>
            <div className="stat-label">kg CO₂</div>
          </div>
          {data.insights.topTravelMode && (
            <div className="stat-card">
              <div className="stat-label">Most Used Transport</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                {data.insights.topTravelMode.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
          🌱 Personalized Recommendations
        </h2>
        {data.recommendations.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No recommendations available. Add some travel or electronics data to get started!
          </p>
        ) : (
          <div>
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <p>
                  <strong>{index + 1}. </strong>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={fetchRecommendations}
          className="btn btn-primary"
          style={{ marginTop: '1.5rem' }}
        >
          🔄 Refresh Recommendations
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem', background: '#f0fdf4' }}>
        <h3 style={{ color: '#166534', marginBottom: '1rem' }}>💡 General Tips</h3>
        <ul style={{ paddingLeft: '1.5rem', color: '#15803d', lineHeight: '2' }}>
          <li>Choose public transport or carpooling when possible</li>
          <li>Enable power-saving modes on your devices</li>
          <li>Unplug devices when not in use to avoid phantom power consumption</li>
          <li>Consider upgrading to energy-efficient appliances</li>
          <li>Plan trips to minimize total distance traveled</li>
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;
