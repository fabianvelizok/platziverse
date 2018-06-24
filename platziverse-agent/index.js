'use strict'

const EventEmitter = require('events')

class PlatziverseAgent extends EventEmitter {
  constructor(opts) {
    super()

    this._options = opts
    this._timer = null
    this._started = false
  }

  connect() {
    if (!this._started) {
      this.emit('connected')
      this._started = true
      this._timer = setInterval(() => {
        this.emit('agent/message', 'A message')
      }, this._options.interval)
    }
  }

  disconnect() {
    if (this._started) {
      this.emit('disconnected')
      clearInterval(this._timer)
      this._started = false
    }
  }
}

module.exports = PlatziverseAgent
