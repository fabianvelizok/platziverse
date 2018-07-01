'use strict'

const jwt = require('jsonwebtoken')

function sign(payload, secret, callback) {
  return jwt.sign(payload, secret, callback)
}

function verify(token, secret, callback) {
  return jwt.sign(token, secret, callback)
}

module.exports = {
  sign,
  verify
}
