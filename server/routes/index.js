var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/messages', function(req, res, next) {
  const { message } = req.body;
  console.log(message);
  res.json({ message: 'Hello, how are you?' });
});

module.exports = router;
