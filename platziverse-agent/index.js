'use strict'

const EventEmitter = require('events')
const debug = require('debug')('platziverse:agent')
const os = require('os')
const util = require('util')
const mqtt = require('mqtt')
const defaults = require('defaults')
const uuidv4 = require('uuid/v4')

const { parsePayload } = require('./utils')

const defaultOpts = {
  name: 'untitled',
  username: 'platzi',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
}

class PlatziverseAgent extends EventEmitter {
  constructor(opts) {
    super()

    this._options = defaults(opts, defaultOpts)
    this._timer = null
    this._started = false
    this._client = null
    this._agentId = null
    this._metrics = new Map()
  }

  connect() {
    if (!this._started) {
      this._started = true
      this._client = mqtt.connect(this._options.mqtt.host)
    
      this._client.subscribe('agent/message')
      this._client.subscribe('agent/connected')
      this._client.subscribe('agent/disconnected')
      
      
      this._client.on('connect', () => {
        this._agentId = uuidv4()
        this.emit('connected', this._agentId)

        this._timer = setInterval(async () => {
          if (this._metrics.size > 0) {
            let message = {
              agent: {
                uuid: this._agentId,
                name: this._options.name,
                username: this._options.username,
                hostname: os.hostname() || 'localhost',
                pid: process.pid
              },
              metrics: [],
              timestamp: new Date().getTime()
            }

            for (let [metric, fn] of this._metrics) {
              // If it's callback, transform it to promise.
              if (fn.length === 1) {
                fn = util.promisify(fn)
              }

              message.metrics.push({
                type: metric,
                value: await Promise.resolve(fn())
              })
            }

            debug('Sending', message)

            this._client.publish('agent/message', JSON.stringify(message))
            this.emit('agent/message', message)
          }

        }, this._options.interval)
      })

      this._client.on('message', (topic, payload) => {
        payload = parsePayload(payload)
        let broadcast = false

        switch (topic) {
          case 'agent/connected':
          case 'agent/disconnected':
          case 'agent/message': 
            broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
            break
        }

        if (broadcast) {
          this.emit(topic, payload)
        }
      })

      this._client.on('error', this.disconnect)
    }
  }

  disconnect() {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected', this._agentId)
      this._client.end()
    }
  }

  addMetric(type, fn) {
    this._metrics.set(type, fn)
  }

  removeMetric(type) {
    this._metrics.delete(type)
  }
}

module.exports = PlatziverseAgent
