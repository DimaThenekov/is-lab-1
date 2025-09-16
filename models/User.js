const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData, callback) {
    const { username, password } = userData;
    
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      
      const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.run(sql, [username, hashedPassword], function(err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, username });
      });
    });
  }

  static findByUsername(username, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  static findById(id, callback) {
    const sql = 'SELECT id, username, created_at FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  static comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  }
}

module.exports = User;