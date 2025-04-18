const db = require('../config/db');

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const findUser = (email, password, callback) => {
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], callback);
};
const findAdmin = (email, password, callback) => {
  const query = "SELECT * FROM admin WHERE email = ? AND password = ?"
  db.query(query, [email, password], callback);
}
const createUser = (name, email, password, callback) => {
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], callback);
};

module.exports = { findUser, findAdmin, createUser, findUserByEmail };
