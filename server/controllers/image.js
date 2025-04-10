const axios = require('../utils/axiosConfig');

const generateImage = async (req, res) => {
  const { message, model } = req.body;

  const requestBody = buildRequestBody(message, model);

  try {
    // default host name: oneapi.gptnb.ai
    // host name: oneapi-cn.gptnb.ai
    // another vender https://hk.uniapi.io
    const response = await axios.post('https://hk.uniapi.io/v1/images/generations', requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.UNI_API_KEY}`
        }
      });

    const data = response.data.data[0];
    res.json({ image: data.url, revised_prompt: data.revised_prompt });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI service' });
  }
}


function buildRequestBody(message, model) {
  let requestBody = {}

  if (model === 'dall-e-3') {
    requestBody = {
      prompt: message,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
      model,
    }
  }

  if (model === 'gpt-4-image' || model === 'gpt-4o-image') {
    requestBody = {
      model,
      messages: [{ role: 'user', content: message }],
    }
  }

  return requestBody;
}


module.exports = {
  generateImage
}

