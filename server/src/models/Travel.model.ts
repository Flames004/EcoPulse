import mongoose, { Document, Schema } from 'mongoose';

export interface ITravel extends Document {
  origin: string;
  destination: string;
  distance: number; // in kilometers
  transportMode: 'car' | 'bus' | 'train' | 'flight';
  emissions: number; // kg CO2
  date: Date;
  createdAt: Date;
}

const TravelSchema: Schema = new Schema({
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  transportMode: {
    type: String,
    enum: ['car', 'bus', 'train', 'flight'],
    required: true,
  },
  emissions: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITravel>('Travel', TravelSchema);
