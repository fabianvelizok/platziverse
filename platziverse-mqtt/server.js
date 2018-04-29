'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const server = new mosca.Server(settings)

server.on('ready', () => {
  const mqtt = `${chalk.green('[platziverse-mqtt]')}`
  console.log(`${mqtt} server is running`)
})
