const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { stream } = require("@netlify/functions");

exports.handler = stream(async (event) => {
    const apiKey = process.env.API_KEY;

    // app.use(cors({
    //     origin: 'https://codrinlarie.github.io'
    // }));

    // app.options('*', cors());

     // Get latitude and longitude from query parameters
    const lat = event.queryStringParameters?.lat;
    const lon = event.queryStringParameters?.lon;

    if (!apiKey) {
        return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key is not configured' })
        };
    }

    if (!lat || !lon) {
        return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Latitude and longitude are required' })
        };
    }

  try {
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    // Use axios to make the API call
    const response = await axios.get(apiUrl, { responseType: 'stream' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
      },
      body: response.data
    };

    } 
    
    catch (error) {

        console.error('Error fetching weather data:', error);
        
        let statusCode = 500;
        let errorMessage = 'An unexpected error occurred';

        if (error.response) {
        statusCode = error.response.status;
        errorMessage = error.response.data.message || 'Error from OpenWeatherMap API';
        } else if (error.request) {
        statusCode = 503;
        errorMessage = 'Unable to reach the weather service';
        }
    }
});
