const common = require('platziverse-common')
const debug = require('debug')('platziverse:api:config')

const config = {
  db: Object.assign({}, common.db.config, { logging: s => debug(s) }),
  auth: {
    secret: process.env.secret || 'platzi'
  }
}

module.exports = config
