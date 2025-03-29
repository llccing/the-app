var express = require('express');
var router = express.Router();
const { handleMessage } = require('../controllers/chat');
const { generateImage } = require('../controllers/image');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello World');
});

router.post('/api/messages', handleMessage);
router.post('/api/images', generateImage);
module.exports = router;
