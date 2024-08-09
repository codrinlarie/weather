const express = require('express');
const axios = require('axios');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const apiKey = process.env.API_KEY;

const app = express();

app.use(cors({
    origin: 'https://codrinlarie.github.io'
  }));

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured' });
    }

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        console.log('Weather data fetched successfully');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching the weather data:', error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(503).json({ error: 'Unable to reach the weather service' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

module.exports.handler = serverless(app);