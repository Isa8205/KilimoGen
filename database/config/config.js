export default {
  development: {
    dialect: 'sqlite',
    storage: './database/db/development.sqlite3', // Path to your SQLite database file
    logging: console.log,
  },
  test: {
    dialect: 'sqlite',
    storage: './database/db/test.sqlite3', // Separate file for test environment
    logging: false, // Disable logging in test mode
  },
  production: {
    dialect: 'sqlite',
    storage: './database/db/production.sqlite3', // Separate file for production
    logging: false, // Disable logging in production
  },
};
