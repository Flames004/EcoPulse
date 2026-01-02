import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface EmissionData {
  totalEmissions: number;
  travelEmissions: number;
  electronicsEmissions: number;
  topTravelMode?: string;
  topDevice?: string;
}

/**
 * Generate AI-powered recommendations based on user's carbon footprint
 * @param emissionData - User's emission data
 * @returns Array of personalized recommendations
 */
export const generateRecommendations = async (
  emissionData: EmissionData
): Promise<string[]> => {
  try {
    const prompt = `You are an environmental consultant. Based on the following carbon footprint data, provide 5 specific, actionable recommendations to reduce emissions:

Total emissions: ${emissionData.totalEmissions.toFixed(2)} kg CO2
Travel emissions: ${emissionData.travelEmissions.toFixed(2)} kg CO2
Electronics emissions: ${emissionData.electronicsEmissions.toFixed(2)} kg CO2
${emissionData.topTravelMode ? `Most used transport: ${emissionData.topTravelMode}` : ''}
${emissionData.topDevice ? `Most impactful device: ${emissionData.topDevice}` : ''}

Provide recommendations as a numbered list (1-5) with each being concise and specific.`;

    const fullPrompt = `You are an environmental consultant specializing in carbon footprint reduction.\n\n${prompt}`;
    
    const response = await model.generateContent(fullPrompt);
    const content = response.response.text() || '';
    
    // Parse the response into individual recommendations
    const recommendations = content
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return recommendations.length > 0 ? recommendations : [
      'Consider using public transportation more often',
      'Reduce device usage during off-peak hours',
      'Carpool when possible',
      'Enable power-saving modes on electronics',
      'Plan trips to minimize total distance traveled',
    ];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return default recommendations if API fails
    return [
      'Consider using public transportation more often',
      'Reduce device usage during off-peak hours',
      'Carpool when possible',
      'Enable power-saving modes on electronics',
      'Plan trips to minimize total distance traveled',
    ];
  }
};
