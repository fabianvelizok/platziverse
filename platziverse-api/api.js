'use strict'

const asyncify = require('express-asyncify')
const common = require('platziverse-common')
const db = require('platziverse-db')
const debug = require('debug')('platziverse:api:routes')
const express = require('express')

const config = Object.assign({}, common.db.config, {
  logging: s => debug(s)
})

// Add support for async / await on middlewares and routes.
const api = asyncify(express.Router()) 

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database...')
    try {
      services = await db(config)
    } catch (e) {
      return next(e) // Express error manager
    }

    Agent = services.Agent
    Metric = services.Metric  
  }
  next()
})

api.get('/agents', async (req, res, next) => {
  debug('New request to /agents')
  
  let agents = []
  try {
    agents = await Agent.findConnected()
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
