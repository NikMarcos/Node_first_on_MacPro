const express = require('express');
const router = express.Router();
const {getUsers, getUserById, getImagesByUserId} = require('../queries')

  /*eslint max-len: ["error", { "code": 100 }]*/
router.get('/', function(req, res, next) {
  console.log(req.session.userName, req.session.userEmail);

  getUsers().then((users)=>{
    console.log(users);
    res.render('users', {owner: 'Nikita', users: users});
  });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  const client = res.app.locals.client;
  client.hgetall(id, (err, object) => {
    if (err) {
      console.log(err);
      res.redirect('/index');
    } else if (object) {
      client.lrange(`images:${id}`, 0, -1, function(err, reply) {
        if (err) {
        console.log(`Массив изображений ${err}`);
        res.redirect('/index');
        }
        res.render('user', {user: [object], images: JSON.parse(reply)});
      });
    } else {
      getUserById(id).then((user)=>{
        getImagesByUserId(id).then((images)=>{
        client.del(id);
        client.del(`images:${id}`);
        client.hset(id, 'id', user[0]['id'], 'name', user[0]['name'], 'email', user[0]['email']);
        client.rpush.apply(client, [`images:${id}`].concat(JSON.stringify(images)));
        res.render('user', {user: user, images: images});
     });
   });
   }
 });
});


module.exports = router;
