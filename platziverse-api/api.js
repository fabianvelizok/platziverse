'use strict'

const asyncify = require('express-asyncify')
const db = require('platziverse-db')
const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const auth = require('express-jwt')

const config = require('./config')

// Add support for async / await on middlewares and routes.
const api = asyncify(express.Router()) 

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database...')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e) // Express error manager
    }

    Agent = services.Agent
    Metric = services.Metric  
  }
  next()
})

api.get('/agents', auth(config.auth), async (req, res, next) => {
  debug('New request to /agents')

  const { user } = req

  if (!user || !user.username) {
    return next(new Error('Not authorized'))
  }
  
  let agents = []
  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findByUsername(user.username)
    }
  } catch (e) {
    next(e)
  }
    
  res.send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`New request to /agent/${uuid}`)

  let agent = null
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (e) {
    next(e)
  }

  if (!agent) {
    return next(new Error(`Agent with uuid: ${uuid} does not exist`))
  }

  res.send(agent)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`New request to /metrics/${uuid}`)

  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`There is no metrics for the agent with uuid: ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  debug(`New request to /metrics/${uuid}/${type}`)

  let metrics = []
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`There is no metrics (${type}) for the agent with uuid: ${uuid}`))
  }

  res.send(metrics)
})

module.exports = api
