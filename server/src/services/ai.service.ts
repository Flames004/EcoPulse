import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an environmental consultant specializing in carbon footprint reduction.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || '';
    
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
