import mongoose, { Document, Schema } from 'mongoose';

export interface IElectronics extends Document {
  deviceName: string;
  deviceType: 'laptop' | 'desktop' | 'phone' | 'tablet' | 'monitor' | 'tv' | 'other';
  powerConsumption: number; // watts
  hoursPerDay: number;
  manufacturingEmissions: number; // kg CO2 (one-time)
  usageEmissions: number; // kg CO2 (calculated)
  purchaseDate: Date;
  active: boolean;
  createdAt: Date;
}

const ElectronicsSchema: Schema = new Schema({
  deviceName: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['laptop', 'desktop', 'phone', 'tablet', 'monitor', 'tv', 'other'],
    required: true,
  },
  powerConsumption: {
    type: Number,
    required: true,
  },
  hoursPerDay: {
    type: Number,
    required: true,
  },
  manufacturingEmissions: {
    type: Number,
    required: true,
  },
  usageEmissions: {
    type: Number,
    default: 0,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IElectronics>('Electronics', ElectronicsSchema);
