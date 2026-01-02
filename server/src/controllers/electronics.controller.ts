import { Request, Response } from 'express';
import Electronics from '../models/Electronics.model';
import { calculateDailyUsageEmissions } from '../utils/calculations';
import { DEVICE_MANUFACTURING_EMISSIONS, DeviceType } from '../utils/emissionFactors';

/**
 * Add a new electronics device
 */
export const addDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deviceName, deviceType, powerConsumption, hoursPerDay, purchaseDate } = req.body;

    if (!deviceName || !deviceType || !powerConsumption || !hoursPerDay) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const manufacturingEmissions = DEVICE_MANUFACTURING_EMISSIONS[deviceType as DeviceType];
    const dailyUsageEmissions = calculateDailyUsageEmissions(powerConsumption, hoursPerDay);

    const device = new Electronics({
      deviceName,
      deviceType,
      powerConsumption,
      hoursPerDay,
      manufacturingEmissions,
      usageEmissions: dailyUsageEmissions,
      purchaseDate: purchaseDate || new Date(),
    });

    await device.save();

    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ error: 'Failed to add device' });
  }
};

/**
 * Get all devices
 */
export const getAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const devices = await Electronics.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

/**
 * Get electronics statistics
 */
export const getElectronicsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const devices = await Electronics.find({ active: true });
    
    const totalManufacturingEmissions = devices.reduce(
      (sum, device) => sum + device.manufacturingEmissions,
      0
    );
    
    const dailyUsageEmissions = devices.reduce(
      (sum, device) => sum + device.usageEmissions,
      0
    );

    const byType = devices.reduce((acc, device) => {
      if (!acc[device.deviceType]) {
        acc[device.deviceType] = {
          count: 0,
          manufacturingEmissions: 0,
          dailyUsageEmissions: 0,
        };
      }
      acc[device.deviceType].count++;
      acc[device.deviceType].manufacturingEmissions += device.manufacturingEmissions;
      acc[device.deviceType].dailyUsageEmissions += device.usageEmissions;
      return acc;
    }, {} as Record<string, { count: number; manufacturingEmissions: number; dailyUsageEmissions: number }>);

    res.json({
      success: true,
      data: {
        totalManufacturingEmissions,
        dailyUsageEmissions,
        monthlyUsageEmissions: dailyUsageEmissions * 30,
        yearlyUsageEmissions: dailyUsageEmissions * 365,
        totalDevices: devices.length,
        byType,
      },
    });
  } catch (error) {
    console.error('Error fetching electronics stats:', error);
    res.status(500).json({ error: 'Failed to fetch electronics statistics' });
  }
};

/**
 * Update device
 */
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.powerConsumption || updates.hoursPerDay) {
      const device = await Electronics.findById(id);
      if (device) {
        const powerConsumption = updates.powerConsumption || device.powerConsumption;
        const hoursPerDay = updates.hoursPerDay || device.hoursPerDay;
        updates.usageEmissions = calculateDailyUsageEmissions(powerConsumption, hoursPerDay);
      }
    }

    const device = await Electronics.findByIdAndUpdate(id, updates, { new: true });
    res.json({ success: true, data: device });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Failed to update device' });
  }
};

/**
 * Delete device
 */
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Electronics.findByIdAndDelete(id);
    res.json({ success: true, message: 'Device deleted' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
};
