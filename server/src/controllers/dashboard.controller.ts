import { Request, Response } from 'express';
import Travel from '../models/Travel.model';
import Electronics from '../models/Electronics.model';

/**
 * Get dashboard overview with all statistics
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Travel data
    const travels = await Travel.find({ date: { $gte: startDate } });
    const travelEmissions = travels.reduce((sum, travel) => sum + travel.emissions, 0);

    // Electronics data
    const devices = await Electronics.find({ active: true });
    const dailyElectronicsEmissions = devices.reduce(
      (sum, device) => sum + device.usageEmissions,
      0
    );
    const electronicsEmissions = dailyElectronicsEmissions * days;

    // Total emissions
    const totalEmissions = travelEmissions + electronicsEmissions;

    // Calculate daily averages
    const dailyAverage = totalEmissions / days;

    // Get monthly trend data
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const monthTravels = await Travel.find({
        date: { $gte: monthStart, $lt: monthEnd },
      });

      const monthTravelEmissions = monthTravels.reduce(
        (sum, travel) => sum + travel.emissions,
        0
      );

      const daysInMonth = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
      ).getDate();

      const monthElectronicsEmissions = dailyElectronicsEmissions * daysInMonth;

      monthlyData.unshift({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        travel: Math.round(monthTravelEmissions * 100) / 100,
        electronics: Math.round(monthElectronicsEmissions * 100) / 100,
        total: Math.round((monthTravelEmissions + monthElectronicsEmissions) * 100) / 100,
      });
    }

    res.json({
      success: true,
      data: {
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        travelEmissions: Math.round(travelEmissions * 100) / 100,
        electronicsEmissions: Math.round(electronicsEmissions * 100) / 100,
        dailyAverage: Math.round(dailyAverage * 100) / 100,
        period: days,
        breakdown: {
          travel: Math.round((travelEmissions / totalEmissions) * 100) || 0,
          electronics: Math.round((electronicsEmissions / totalEmissions) * 100) || 0,
        },
        monthlyTrend: monthlyData,
        totalTrips: travels.length,
        activeDevices: devices.length,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
