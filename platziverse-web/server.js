'use strict'

const asyncify = require('express-asyncify')
const chalk = require('chalk')
const debug = require('debug')('platziverse:web')
const express = require('express')
const http = require('http')
const path = require('path')
const PlatziverseAgent = require('platziverse-agent')
const socket = require('socket.io')


const proxy = require('./proxy')
const { pipe } = require('./utils')

const port = process.env.PORT || 8080
const app = asyncify(express())
const server = http.createServer(app)
const io = socket(server)
const agent = new PlatziverseAgent()

io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

// Error handler
app.use((err, req, res) => {
  debug(`Error: ${err.message}`)

  if (err.message && err.message.match(/not found/)) {
    res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
