var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expressss' });
});

router.get('/panda', function(req, res, next) {
  res.render('index', { title: '11111' });
});

module.exports = router;
