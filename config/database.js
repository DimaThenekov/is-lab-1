const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const init = () => {
  return new Promise((resolve, reject) => {
    // Create users table
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) reject(err);
    });

    // Create posts table
    db.run(`CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) reject(err);
      
      // Insert some sample data
      const samplePosts = [
        { title: 'First Post', content: 'This is the first post', userId: 1 },
        { title: 'Second Post', content: 'This is the second post', userId: 1 }
      ];
      
      samplePosts.forEach(post => {
        db.run(
          'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
          [post.title, post.content, post.userId]
        );
      });
      
      resolve();
    });
  });
};

module.exports = {
  db,
  init
};