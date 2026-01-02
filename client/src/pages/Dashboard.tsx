import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import type { DashboardData } from '../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard(period);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="error">Failed to load dashboard data</div>;
  }

  const pieData = [
    { name: 'Travel', value: data.travelEmissions, color: '#667eea' },
    { name: 'Electronics', value: data.electronicsEmissions, color: '#764ba2' },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Emissions</div>
          <div className="stat-value">{data.totalEmissions.toFixed(2)}</div>
          <div className="stat-label">kg CO₂</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Daily Average</div>
          <div className="stat-value">{data.dailyAverage.toFixed(2)}</div>
          <div className="stat-label">kg CO₂/day</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Trips</div>
          <div className="stat-value">{data.totalTrips}</div>
          <div className="stat-label">journeys</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Devices</div>
          <div className="stat-value">{data.activeDevices}</div>
          <div className="stat-label">electronics</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Emissions Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)} kg`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Travel', value: data.travelEmissions },
              { name: 'Electronics', value: data.electronicsEmissions },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="travel" stroke="#667eea" strokeWidth={2} name="Travel" />
            <Line type="monotone" dataKey="electronics" stroke="#764ba2" strokeWidth={2} name="Electronics" />
            <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
