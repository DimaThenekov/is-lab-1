const { db } = require('../config/database');

class Post {
  static findAll(callback) {
    const sql = 'SELECT * FROM posts';
    
    db.all(sql, [], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  static findByUserId(userId, callback) {
    const sql = 'SELECT * FROM posts WHERE user_id = ?';
    
    db.all(sql, [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  static create(postData, callback) {
    const { title, content, userId } = postData;
    const sql = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';
    
    db.run(sql, [title, content, userId], function(err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, title, content, userId });
    });
  }
}

module.exports = Post;