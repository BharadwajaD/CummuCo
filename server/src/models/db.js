const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

function getUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        reject(new Error('Internal server error'));
      } else if (!user) {
        reject(new Error('Invalid username or password'));
      } else {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          resolve({ userid: user.id, role: 'traveler' });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }
    });
  });
}

function setUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        reject(new Error('Internal server error'));
      } else if (user) {
        reject(new Error(`User ${username} already exists`));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
          if (err) {
            reject(new Error('Internal server error'));
          } else {
            resolve('User registered successfully');
          }
        });
      }
    });
  });
}

module.exports = { db, getUser, setUser };
