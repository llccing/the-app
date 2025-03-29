var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/messages', async function (req, res, next) {
  try {
    const { message, model } = req.body;
    console.log('model', model);

    const requestBody = {
      model,
      messages: [{ role: 'user', content: message }],
    }
    let temperature = 0.7;
    if (model === 'o1-mini') {
      // o1-mini's temperature is 1
      requestBody.temperature = 1
    } else if (model !== 'o1' && model !== 'o3-mini') {
      // o1 is not support temperature
      // o3-mini is not support temperature
      requestBody.temperature = 0.7
    }


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
});

module.exports = router;
