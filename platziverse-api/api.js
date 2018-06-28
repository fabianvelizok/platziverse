'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const db = require('platziversedb')

const config = require('./config')
const api = express.Router()

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

api.get('/agents', (req, res) => {
  res.send({})
})

api.get('/agent/:uuid', (req, res, next) => {
  const { uuid } = req.params
  if (!uuid) {
    return next(new Error('[uuid] doesn\'t exist'))
  }
  res.send({ uuid })
})

api.get('/metrics/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api
