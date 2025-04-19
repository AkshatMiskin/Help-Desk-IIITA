const db = require('../config/db');

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};
// const findUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT * FROM users WHERE email = ?";
//     db.query(query, [email], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]); // only return one user
//     });
//   });
// };


// const findUserByCredentials = (email, password) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT * FROM users WHERE email = ? AND password = ?";
//     db.query(query, [email, password], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]); // return only one user
//     });
//   });
// };
// const findUser = (email, password, callback) => {
//   const query = "SELECT * FROM users WHERE email = ? AND password = ?";
//   db.query(query, [email, password], callback);
// };
// const findAdmin = (email, password, callback) => {
//   const query = "SELECT * FROM admin WHERE email = ? AND password = ?"
//   db.query(query, [email, password], callback);
// }
const createUser = (name, email, hashedPassword, role, callback) => {
  const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, role], callback);
};


module.exports = {  createUser, findUserByEmail };
