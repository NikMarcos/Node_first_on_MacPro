const Pool = require('pg').Pool;
const {db} = require('./config/config.js');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: db.user,
  host: db.host,
  database: db.name,
  password: db.password,
  port: db.port,
});

const getUsers = () => {
  return new Promise(function (resolve, reject){
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
      reject(0);
    }
    resolve(results.rows);
  })
});
}

const getUserById = (id) => {
  return new Promise(function (resolve, reject){
  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
      reject(0);
    }
    resolve(results.rows);
  })
});
};

// let rollback = function(pool) {
//   pool.query('ROLLBACK');
// };
//
// const getUserById = (id) => {
//   return new Promise(function (resolve, reject){
//     pool.query('BEGIN', function(err, result) {
//       if(err) return rollback(pool);
//       pool.query('INSERT INTO account(money) VALUES(100) WHERE id = $1', [1], function(err, result) {
//         if(err) return rollback(pool);
//         pool.query('INSERT INTO account(money) VALUES(-100) WHERE id = $1', [2], function(err, result) {
//           if(err) return rollback(client);
//       //disconnect after successful commit
//         pool.query('COMMIT');
//     });
//   });
// });
//   })
// }

const findUser = (email, pass) => {
  let password = pass;
  // let email = email;
  return new Promise(function (resolve, reject){
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      if (error) {
        throw error
        reject(0);
      } else {
        let res = result.rows;
        if (res.length > 0) {
          console.log(result.rows);
          let arrUsers = result.rows;
          let passField = arrUsers[0]['password'];
          let isPassword = bcrypt.compareSync(password, passField);
          if (isPassword) {
            resolve(result.rows);
          } else {
            reject(0);
          }
        } else {
          reject(0);
        }
      }
    })
  });
};

const createUser = (name, email, pass) => {
  const saltRounds = 5;
  let password = pass;
  let salt = bcrypt.genSaltSync(saltRounds);
  let hashPassword = bcrypt.hashSync(password, salt);
  return new Promise(function (resolve, reject){
    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashPassword], (error, result) => {
      if (error) {
        throw error
        reject(0);
      }
      resolve(result);
    })
  });
}

const updateUser = (id, name, email) => {
  // const id = parseInt(request.params.id)
  // const { name, email } = request.body
  return new Promise(function (resolve, reject){
    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3',[name, email, id], (error, results) => {
      if (error) {
        throw error
        reject(0);
      }
      resolve('OK');
    })
  });
}

// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id)
//
//   pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }

const saveImage = (userId, filename) => {
  return new Promise(function (resolve, reject){
  pool.query('INSERT INTO images (user_id, image) VALUES ($1, $2)', [userId, filename], (error, results) => {
    if (error) {
      throw error
      reject(0);
    }
    resolve("OK");
  })
});
}

const getImagesByUserId = (userId) => {
  return new Promise(function (resolve, reject){
  pool.query('SELECT * FROM images WHERE user_id = $1', [userId], (error, results) => {
    if (error) {
      throw error
      reject(0);
    }
    resolve(results.rows);
  })
});
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  findUser,
  // deleteUser,
  saveImage,
  getImagesByUserId
}
