import axios from 'axios';

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        value: number; // meters
        text: string;
      };
      duration: {
        value: number; // seconds
        text: string;
      };
      status: string;
    }>;
  }>;
  status: string;
}

/**
 * Get distance between two locations using Google Maps Distance Matrix API
 * @param origin - Starting location
 * @param destination - Destination location
 * @returns Distance in kilometers
 */
export const getDistance = async (
  origin: string,
  destination: string
): Promise<number> => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get<DistanceMatrixResponse>(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          origins: origin,
          destinations: destination,
          key: apiKey,
        },
      }
    );

    if (response.data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const element = response.data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      throw new Error(`Unable to calculate distance: ${element.status}`);
    }

    // Convert meters to kilometers
    const distanceInKm = element.distance.value / 1000;
    return Math.round(distanceInKm * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error fetching distance from Google Maps:', error);
    throw error;
  }
};
