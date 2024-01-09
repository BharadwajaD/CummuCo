const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./cummuco.db');

db.serialize(() => {
  // Create the 'users' table if it does not exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create the 'rides' table if it does not exist
  db.run(`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY,
      ride_info TEXT NOT NULL
    )
  `);

  // Create the 'user_ride_roles' table if it does not exist
  db.run(`
    CREATE TABLE IF NOT EXISTS user_ride_roles (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      ride_id INTEGER,
      role TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (ride_id) REFERENCES rides(id)
    )
  `);
})

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
          resolve({ user_id: user.id, role: '' , ride_id: ''});
        } else {
          reject(new Error('Invalid username or password'));
        }
      }
    });
  });
}


function getUserName(user_id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT username FROM users WHERE id = ?', [user_id], async (err, username) => {
      if (err) {
        reject(new Error('Internal server error'));
      } else if (!username) {
        reject(new Error('Invalid user_id'));
      } else {
          resolve(username);
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
            reject(new Error(err.message));
          } else {
            resolve('User registered successfully');
          }
        });
      }
    });
  });
}

function insertRide(ride_info) {
  const insertQuery = 'INSERT INTO rides (ride_info) VALUES (?)';

  return new Promise((resolve, reject) => {
    db.run(insertQuery, [ride_info], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve({rideId: this.lastID});
      }
    });
  });
}


// Function to insert user role into the database only if it doesn't already exist
function insertUserRole(user_id, ride_id, role) {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the user, ride, and role combination already exists
      const isValid = await isValidRole(user_id, ride_id, role);

      if (!isValid) {
        // If not, perform the insertion
        const insertQuery = 'INSERT INTO user_ride_roles (user_id, ride_id, role) VALUES (?, ?, ?)';
        db.run(insertQuery, [user_id, ride_id, role], function (err) {
          if (err) {
            reject(err.message);
          } else {
            resolve({ user_id, role, ride_id });
          }
        });
      } else {
        resolve({ user_id, role, ride_id });
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}
/*
function insertUserRole(user_id, ride_id, role) {
  const insertQuery = 'INSERT INTO user_ride_roles (user_id, ride_id, role) VALUES (?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(insertQuery, [user_id, ride_id, role], function (err) {
      if (err) {
        reject(err.message);
      } else {
          resolve({ user_id, role , ride_id});
      }
    });
  });
}
*/

function isValidRole(user_id, ride_id, role){
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM user_ride_roles
      WHERE user_id = ? AND ride_id = ? AND role = ?
    ) AS entry_exists;
  `;

  return new Promise((resolve, reject) => {
    db.get(query, [user_id, ride_id, role], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
          console.log('isValidRole: ', user_id, role, ride_id, row)
        resolve(row.entry_exists === 1);
      }
    });
  });
}

module.exports = { db, getUser, getUserName, setUser, insertRide, insertUserRole, isValidRole };
