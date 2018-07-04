'use strict'

const chalk = require('chalk')
const debug = require('debug')('platziverse:web')
const express = require('express')
const http = require('http')
const path = require('path')
const socket = require('socket.io')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socket(server)

io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  socket.on('agent/message', payload => {
    console.log(payload)
  })

  setInterval(() => {
    socket.emit('agent/message', { agent: 'xyz'})
  }, 5000)
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
})

function handleFatalError(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
