'use strict'

const chalk = require('chalk')
const common = require('platziverse-common')
const db = require('platziverse-db')
const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const { parsePayload } = require('./utils')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

const config = Object.assign({}, common.db.config, {
  logging: s => debug(s)
})

const server = new mosca.Server(settings)
const clients = new Map()

let Agent, Metric

server.on('clientConnected', client => {
  debug(`Client connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', async client => {
  debug(`Client Disconnected: ${client.id}`)
  const agent = clients.get(client.id)
  
  if (agent) {
    // Mark as disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }

    // Delete agent from client list
    clients.delete(client.id)
    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })

    debug(`Client ${client.id} associated to agent ${agent.uuid} was mark as disconnected`)
  }
})

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`)

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message': {
      debug(`Payload: ${packet.payload}`)
      const payload = parsePayload(packet.payload)
      if (payload) {
        payload.agent.connected = true

        let agent

        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError(e)
        }

        debug(`Agent ${agent.uuid} was saved`)

        // Notify new connected agent
        if (!clients.get(client.id)) {
          clients.set(client.id)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                username: agent.username,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store metrics
        for (let metric of payload.metrics) {
          let m

          try {
            m = await Metric.create(agent.uuid, metric)
          } catch (e) {
            return handleError(e)
          }

          debug(`Metric ${m.id} was saved on Agent ${agent.uuid}`)
        }
      }
      break
    }
  }
})

server.on('ready', async () => {
  const services = await db(config).catch(handleFatalError)
  Agent = services.Agent
  Metric = services.Metric
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleError (err) {
  console.error(`${chalk.red('[error]')} ${err.message}`)
  console.error(err.stack)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
