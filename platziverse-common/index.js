// Database
const config = require('./db/config')

// Tests
const fixtures = require('./tests/fixtures')

module.exports = {
  db: {
    config
  },
  tests: {
    fixtures
  }
}

