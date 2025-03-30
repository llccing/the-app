const axios = require('../utils/axiosConfig');
const handleMessage = async (req, res) => {
  try {
    const { message, model } = req.body;
    console.log('model', model);

    const requestBody = buildRequestBody(message, model);
   
    const response = await axios.post('https://oneapi.gptnb.ai/v1/chat/completions', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    });

    // Send back the AI's response
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI service' });
  }
};

function buildRequestBody(message, model) {
  const requestBody = {
    model,
    messages: [{ role: 'user', content: message }],
  }
  // o1 is not support temperature
  // o3-mini is not support temperature
  if (model !== 'o1' && model !== 'o3-mini') {
    requestBody.temperature = 0.7
  } else if (model === 'o1-mini') {
    // o1-mini's temperature is 1
    requestBody.temperature = 1
  }

  return requestBody;
}

module.exports = {
  handleMessage
};
