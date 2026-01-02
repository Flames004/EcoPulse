import axios from 'axios';
import type { Travel, Electronics, DashboardData, Recommendations } from '../types';

const API_BASE_URL = '/api';

// Travel APIs
export const addTravel = async (data: {
  origin: string;
  destination: string;
  transportMode: string;
  date?: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/travel`, data);
  return response.data;
};

export const getAllTravels = async () => {
  const response = await axios.get<{ success: boolean; data: Travel[] }>(
    `${API_BASE_URL}/travel`
  );
  return response.data;
};

export const getTravelStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/travel/stats`);
  return response.data;
};

export const deleteTravel = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/travel/${id}`);
  return response.data;
};

// Electronics APIs
export const addDevice = async (data: {
  deviceName: string;
  deviceType: string;
  powerConsumption: number;
  hoursPerDay: number;
  purchaseDate?: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/electronics`, data);
  return response.data;
};

export const getAllDevices = async () => {
  const response = await axios.get<{ success: boolean; data: Electronics[] }>(
    `${API_BASE_URL}/electronics`
  );
  return response.data;
};

export const getElectronicsStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/electronics/stats`);
  return response.data;
};

export const updateDevice = async (id: string, data: Partial<Electronics>) => {
  const response = await axios.put(`${API_BASE_URL}/electronics/${id}`, data);
  return response.data;
};

export const deleteDevice = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/electronics/${id}`);
  return response.data;
};

// Dashboard API
export const getDashboard = async (period: number = 30) => {
  const response = await axios.get<{ success: boolean; data: DashboardData }>(
    `${API_BASE_URL}/dashboard?period=${period}`
  );
  return response.data;
};

// Recommendations API
export const getRecommendations = async () => {
  const response = await axios.get<{ success: boolean; data: Recommendations }>(
    `${API_BASE_URL}/recommendations`
  );
  return response.data;
};
