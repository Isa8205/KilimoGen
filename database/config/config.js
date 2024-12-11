const path = require('node:path')

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), // Path to your SQLite database file
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // In-memory database for testing
  },
  production: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
};
