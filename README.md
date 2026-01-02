# EcoPulse - Carbon Footprint Tracking App

A comprehensive carbon footprint tracking application that helps users monitor and reduce their environmental impact through travel and electronics usage tracking.

## Features

- 🚗 **Travel Tracking**: Calculate emissions from various modes of transport using Google Maps API
- 💻 **Electronics Tracking**: Monitor energy consumption and emissions from electronic devices
- 📊 **Interactive Dashboard**: Visualize your carbon footprint with charts and statistics
- 🤖 **AI Recommendations**: Get personalized suggestions to reduce your carbon footprint
- 📈 **Trend Analysis**: Track your emissions over time with monthly trends

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Recharts for data visualization
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- MongoDB for data persistence
- Google Maps Distance Matrix API
- OpenAI GPT for AI recommendations

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Google Maps API key
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd EcoPulse
```

2. **Set up the backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your API keys:
# - MONGODB_URI
# - GOOGLE_MAPS_API_KEY
# - OPENAI_API_KEY
```

3. **Set up the frontend**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend server**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

3. **Start the frontend** (in a new terminal)
```bash
cd client
npm run dev
```
Frontend will run on http://localhost:3000

## Project Structure

```
EcoPulse/
├── client/                     # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Travel.tsx
│   │   │   ├── Electronics.tsx
│   │   │   └── Recommendations.tsx
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── models/            # MongoDB models
│   │   │   ├── Travel.model.ts
│   │   │   └── Electronics.model.ts
│   │   ├── controllers/       # Route controllers
│   │   │   ├── travel.controller.ts
│   │   │   ├── electronics.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── recommendations.controller.ts
│   │   ├── routes/            # API routes
│   │   │   ├── travel.routes.ts
│   │   │   ├── electronics.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── recommendations.routes.ts
│   │   ├── services/          # External services
│   │   │   ├── googleMaps.service.ts
│   │   │   └── ai.service.ts
│   │   ├── utils/             # Utilities
│   │   │   ├── calculations.ts
│   │   │   └── emissionFactors.ts
│   │   ├── config/
│   │   │   └── database.ts
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

## API Endpoints

### Travel
- `POST /api/travel` - Add new travel entry
- `GET /api/travel` - Get all travels
- `GET /api/travel/stats` - Get travel statistics
- `DELETE /api/travel/:id` - Delete travel entry

### Electronics
- `POST /api/electronics` - Add new device
- `GET /api/electronics` - Get all devices
- `GET /api/electronics/stats` - Get electronics statistics
- `PUT /api/electronics/:id` - Update device
- `DELETE /api/electronics/:id` - Delete device

### Dashboard
- `GET /api/dashboard?period=30` - Get dashboard data for specified period

### Recommendations
- `GET /api/recommendations` - Get AI-powered recommendations

## Emission Calculation

### Travel Emissions
Based on transport mode (kg CO₂ per km):
- Car: 0.21
- Bus: 0.089
- Train: 0.041
- Flight: 0.255

### Electronics Emissions
- **Manufacturing**: One-time emissions based on device type
- **Usage**: Daily emissions = (Power in kW × hours/day × 0.5 kg CO₂/kWh)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Goal setting and achievement tracking
- [ ] Social features to compare with friends
- [ ] Mobile app version
- [ ] Integration with smart home devices
- [ ] Carbon offset marketplace
- [ ] Detailed analytics and reports
