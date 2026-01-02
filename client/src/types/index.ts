export interface Travel {
  _id: string;
  origin: string;
  destination: string;
  distance: number;
  transportMode: 'car' | 'bus' | 'train' | 'flight';
  emissions: number;
  date: string;
  createdAt: string;
}

export interface Electronics {
  _id: string;
  deviceName: string;
  deviceType: 'laptop' | 'desktop' | 'phone' | 'tablet' | 'monitor' | 'tv' | 'other';
  powerConsumption: number;
  hoursPerDay: number;
  manufacturingEmissions: number;
  usageEmissions: number;
  purchaseDate: string;
  active: boolean;
  createdAt: string;
}

export interface DashboardData {
  totalEmissions: number;
  travelEmissions: number;
  electronicsEmissions: number;
  dailyAverage: number;
  period: number;
  breakdown: {
    travel: number;
    electronics: number;
  };
  monthlyTrend: Array<{
    month: string;
    travel: number;
    electronics: number;
    total: number;
  }>;
  totalTrips: number;
  activeDevices: number;
}

export interface Recommendations {
  recommendations: string[];
  insights: {
    totalEmissions: number;
    travelEmissions: number;
    electronicsEmissions: number;
    topTravelMode?: string;
    topDevice?: string;
  };
}
