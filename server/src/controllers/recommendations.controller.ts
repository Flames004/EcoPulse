import { Request, Response } from 'express';
import Travel from '../models/Travel.model';
import Electronics from '../models/Electronics.model';
import { generateRecommendations } from '../services/ai.service';

/**
 * Get AI-powered recommendations based on user's carbon footprint
 */
export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get travel data
    const travels = await Travel.find();
    const travelEmissions = travels.reduce((sum, travel) => sum + travel.emissions, 0);

    // Find most used transport mode
    const transportCounts = travels.reduce((acc, travel) => {
      acc[travel.transportMode] = (acc[travel.transportMode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topTravelMode = Object.entries(transportCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Get electronics data
    const devices = await Electronics.find({ active: true });
    const dailyElectronicsEmissions = devices.reduce(
      (sum, device) => sum + device.usageEmissions,
      0
    );
    const electronicsEmissions = dailyElectronicsEmissions * 30; // Last 30 days

    // Find device with highest emissions
    const topDevice = devices.sort((a, b) => b.usageEmissions - a.usageEmissions)[0];

    const totalEmissions = travelEmissions + electronicsEmissions;

    // Generate AI recommendations
    const recommendations = await generateRecommendations({
      totalEmissions,
      travelEmissions,
      electronicsEmissions,
      topTravelMode,
      topDevice: topDevice?.deviceName,
    });

    res.json({
      success: true,
      data: {
        recommendations,
        insights: {
          totalEmissions: Math.round(totalEmissions * 100) / 100,
          travelEmissions: Math.round(travelEmissions * 100) / 100,
          electronicsEmissions: Math.round(electronicsEmissions * 100) / 100,
          topTravelMode,
          topDevice: topDevice?.deviceName,
        },
      },
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};
