const cache = require('../../lib/cache');

/**
 * EXAMPLE: Advanced Command with Caching
 * This demonstrates best practices for more complex commands
 * 
 * Usage: .weather [city]  - Get weather for city (cached for 1 hour)
 */

module.exports = {
  name: 'weather',
  aliases: ['temp', 'forecast'],
  category: 'general',
  description: 'Get weather information (example with caching)',
  usage: '.weather [city]',
  
  // Optional: Add help text
  help: `
Get weather information for any city.
The result is cached for 1 hour to reduce API calls.

Usage:
  .weather Lagos
  .weather "New York"
  .weather London

This is an example command showing:
  1. Input validation
  2. Data caching with TTL
  3. Error handling
  4. Formatted output
`,

  async execute(ctx) {
    try {
      // Get city from args
      const city = ctx.args.join(' ').trim();

      if (!city) {
        await ctx.reply('❌ Please provide a city name\n\nUsage: .weather Lagos');
        return;
      }

      // Validate city name (no special chars)
      if (!/^[a-zA-Z\s\-]+$/.test(city)) {
        await ctx.reply('❌ City name contains invalid characters');
        return;
      }

      // Try to get from cache first
      const cacheKey = `weather:${city.toLowerCase()}`;
      const weatherData = await cache.getCached(
        cacheKey,
        async () => {
          return await fetchWeatherData(city);
        },
        3600 // Cache for 1 hour
      );

      if (!weatherData) {
        await ctx.reply(`❌ Could not find weather data for "${city}"`);
        return;
      }

      // Format and send response
      const response = formatWeatherResponse(weatherData);
      await ctx.reply(response);

    } catch (error) {
      await ctx.reply('❌ Failed to fetch weather data');
    }
  }
};

/**
 * Helper: Fetch weather data from API
 * This is a placeholder - in real usage, call actual weather API
 */
async function fetchWeatherData(city) {
  // Example: Call weather API
  // In real usage: fetch from OpenWeatherMap, Weather API, etc.
  
  // Placeholder data
  return {
    city: city,
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    feelsLike: 30,
  };
}

/**
 * Helper: Format weather data for display
 */
function formatWeatherResponse(data) {
  return `
☀️ Weather for ${data.city}

🌡️  Temperature: ${data.temperature}°C
Feel: ${data.feelsLike}°C
Condition: ${data.condition}
💧 Humidity: ${data.humidity}%
💨 Wind: ${data.windSpeed} km/h

Data cached for faster retrieval
  `.trim();
}
