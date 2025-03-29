const axios = require('../utils/axiosConfig');

const generateImage = async (req, res) => {
  const { prompt, model } = req.body;

  const requestBody = {
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'url',
    model,
  }
  try {
    const response = await axios.post('https://oneapi.gptnb.ai/v1/images/generations', requestBody,
      {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });

    res.json({ image: response.data.data[0].url });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI service' });
  }
}

module.exports = {
  generateImage
}

