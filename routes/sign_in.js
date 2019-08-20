const express = require('express');
const router = express.Router();
const {findUser} = require('../queries')

router.get('/', function(req, res, next) {
  let regstatus = res.locals.regstatus;
  if (regstatus == true) {
    res.redirect('/users');
  } else {
    res.render('sign_in');
  }
});

router.post('/', function(req, res, next) {
  let email = req.body.email;
  let pass = req.body.pass;
  findUser(email, pass).then((user)=>{
    if (user) {
      req.session.userName = user[0]['name'];
      req.session.userEmail = user[0]['email'];
      req.session.id = user[0]['id'];
      res.redirect('/users');
    } else {
      res.render('sign_in');
    }
  }).catch(function(e) {
    res.render('sign_in');
  });
});

router.get('/out', function(req, res, next) {
    req.session.destroy();
    // console.log(req.session.userName, req.session.userEmail);
    res.redirect('/sign_in');
});

module.exports = router;
