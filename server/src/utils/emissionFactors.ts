// Emission factors for different transport modes (kg CO2 per km)
export const TRANSPORT_EMISSIONS = {
  car: 0.21,
  bus: 0.089,
  train: 0.041,
  flight: 0.255,
} as const;

// Manufacturing emissions for electronic devices (kg CO2)
export const DEVICE_MANUFACTURING_EMISSIONS = {
  laptop: 300,
  desktop: 350,
  phone: 80,
  tablet: 120,
  monitor: 200,
  tv: 400,
  other: 100,
} as const;

// Grid emission factor (kg CO2 per kWh)
export const GRID_EMISSION_FACTOR = 0.5;

export type TransportMode = keyof typeof TRANSPORT_EMISSIONS;
export type DeviceType = keyof typeof DEVICE_MANUFACTURING_EMISSIONS;
