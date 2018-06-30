'use strict'

const asyncify = require('express-asyncify')
const chalk = require('chalk')
const debug = require('debug')('platziverse:server')
const express = require('express')
const http = require('http')

const api = require('./api')

const port = process.env.PORT || 3000
const app = asyncify(express())
const server = http.createServer(app)

app.use('/api', api)

// Error handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)
  if (err.message && err.message.match(/not found/)) {
    res.status(404).send({ error: err.message })
  }
  res.status(500).send({ error: err.message })
})

/*
 * > node server.js
 * console.log(module.parent); // `null`
 * --------------
 * > node require('./server')
 * console.log(module.parent); // `{ ... }`
 */

if (!module.parent) {
  server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
  })

  function handleFatalError(err) {
    console.error(`${chalk.red('[fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
  }

  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)
}

module.exports = server
