const express = require('express');
const router = express.Router();
const {createUser} = require('../queries')

router.get('/', function(req, res, next) {
    res.render('sign_up');
});

router.post('/', function(req, res, next) {
  let name = req.body.name
  let email = req.body.email
  let pass = req.body.pass
  createUser(name, email, pass).then((new_user)=>{
    console.log(new_user);
    res.redirect('/users/sign_in');
  });
});

module.exports = router;
