import { TRANSPORT_EMISSIONS, GRID_EMISSION_FACTOR, TransportMode } from './emissionFactors';

/**
 * Calculate travel emissions based on distance and transport mode
 * @param distance - Distance in kilometers
 * @param transportMode - Mode of transport
 * @returns Emissions in kg CO2
 */
export const calculateTravelEmissions = (
  distance: number,
  transportMode: TransportMode
): number => {
  const emissionFactor = TRANSPORT_EMISSIONS[transportMode];
  return distance * emissionFactor;
};

/**
 * Calculate daily usage emissions for electronic device
 * @param powerConsumption - Power consumption in watts
 * @param hoursPerDay - Hours used per day
 * @returns Daily emissions in kg CO2
 */
export const calculateDailyUsageEmissions = (
  powerConsumption: number,
  hoursPerDay: number
): number => {
  const kWh = (powerConsumption / 1000) * hoursPerDay;
  return kWh * GRID_EMISSION_FACTOR;
};

/**
 * Calculate total usage emissions over a period
 * @param dailyEmissions - Daily emissions in kg CO2
 * @param days - Number of days
 * @returns Total emissions in kg CO2
 */
export const calculateTotalUsageEmissions = (
  dailyEmissions: number,
  days: number
): number => {
  return dailyEmissions * days;
};
