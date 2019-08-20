const express = require('express');
const router = express.Router();
const { saveImage } = require('../queries');
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
let upload = multer({ storage: storage }).single('avatar');

// router.get('/', function(req, res, next) {
//   let regstatus = res.locals.regstatus;
//   if (regstatus == true) {
//     res.redirect('/users');
//   } else {
//     res.render('sign_in');
//   }
// });

router.post('/', function(req, res, next) {
  const client = res.app.locals.client;
  upload(req, res, function () {
    if(req.file) {
      let filename = req.file.filename;
      let userId = req.body.id;
        saveImage(userId, filename).then((img)=>{
          if (img) {
            client.del(userId);
            client.del(`images:${userId}`);
            res.redirect(`/users/${userId}`);
          } else {
            res.redirect(`/users/${userId}`);
          }
        }).catch(function(e) {
          console.log(e);
    res.redirect(`/users/${userId}`);
  });
} else {
  res.redirect(`/users`);
}
  });
});

// router.get('/out', function(req, res, next) {
//     req.session.destroy();
//     // console.log(req.session.userName, req.session.userEmail);
//     res.redirect('/sign_in');
// });

module.exports = router;
