const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
// const db = new sqlite3.Database('./tsprs.db');
  // Open the database
  async function connectToDatabase() {
    return open({
      filename: './todo.db',
      driver: sqlite3.Database
    });
  }
  module.exports = connectToDatabase;