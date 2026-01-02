import { Request, Response } from 'express';
import Travel from '../models/Travel.model';
import { getDistance } from '../services/googleMaps.service';
import { calculateTravelEmissions } from '../utils/calculations';
import { TransportMode } from '../utils/emissionFactors';

/**
 * Add a new travel entry
 */
export const addTravel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, transportMode, date } = req.body;

    if (!origin || !destination || !transportMode) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Get distance from Google Maps
    const distance = await getDistance(origin, destination);

    // Calculate emissions
    const emissions = calculateTravelEmissions(distance, transportMode as TransportMode);

    // Create travel entry
    const travel = new Travel({
      origin,
      destination,
      distance,
      transportMode,
      emissions,
      date: date || new Date(),
    });

    await travel.save();

    res.status(201).json({
      success: true,
      data: travel,
    });
  } catch (error) {
    console.error('Error adding travel:', error);
    res.status(500).json({ error: 'Failed to add travel entry' });
  }
};

/**
 * Get all travel entries
 */
export const getAllTravels = async (req: Request, res: Response): Promise<void> => {
  try {
    const travels = await Travel.find().sort({ date: -1 });
    res.json({
      success: true,
      data: travels,
    });
  } catch (error) {
    console.error('Error fetching travels:', error);
    res.status(500).json({ error: 'Failed to fetch travel entries' });
  }
};

/**
 * Get travel statistics
 */
export const getTravelStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const travels = await Travel.find();
    
    const totalEmissions = travels.reduce((sum, travel) => sum + travel.emissions, 0);
    const totalDistance = travels.reduce((sum, travel) => sum + travel.distance, 0);
    
    const byMode = travels.reduce((acc, travel) => {
      if (!acc[travel.transportMode]) {
        acc[travel.transportMode] = { count: 0, emissions: 0, distance: 0 };
      }
      acc[travel.transportMode].count++;
      acc[travel.transportMode].emissions += travel.emissions;
      acc[travel.transportMode].distance += travel.distance;
      return acc;
    }, {} as Record<string, { count: number; emissions: number; distance: number }>);

    res.json({
      success: true,
      data: {
        totalEmissions,
        totalDistance,
        totalTrips: travels.length,
        byMode,
      },
    });
  } catch (error) {
    console.error('Error fetching travel stats:', error);
    res.status(500).json({ error: 'Failed to fetch travel statistics' });
  }
};

/**
 * Delete a travel entry
 */
export const deleteTravel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Travel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Travel entry deleted' });
  } catch (error) {
    console.error('Error deleting travel:', error);
    res.status(500).json({ error: 'Failed to delete travel entry' });
  }
};
