import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import travelRoutes from './routes/travel.routes';
import electronicsRoutes from './routes/electronics.routes';
import dashboardRoutes from './routes/dashboard.routes';
import recommendationsRoutes from './routes/recommendations.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to EcoPulse API' });
});

app.use('/api/travel', travelRoutes);
app.use('/api/electronics', electronicsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
