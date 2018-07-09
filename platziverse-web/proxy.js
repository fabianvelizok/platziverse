'use strict'

const asyncify = require('express-asyncify')
const express = require('express')
const request = require('request-promise-native')

const { endpoint, token } = require('./config')

const api = asyncify(express.Router())

api.get('/agents', async (req, res, next) => {
  const options = {
    method: 'GET',
    url: `${endpoint}/api/agents`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    json: true
  }

  let result

  try {
    result = request(options)  
  } catch (e) {
    next(e)
  }
  
  res.send(result)
})

api.get('/agent/:uuid', (req, res) => {

})

api.get('/metrics/:uuid', (req, res) => {

})

api.get('/metrics/:uuid/:type', (req, res) => {

})

module.exports = api
