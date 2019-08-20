var express = require('express');
var router = express.Router();
const app = express();

router.get('/', function(req, res, next) {
  const client = res.app.locals.client;
  client.hgetall('index', function(err, object) {
    if (object) {
      res.render('index', object);
    } else {
      res.render('index', {title: 'My', name: 'Niks'});
    }

 });

});

module.exports = router;
