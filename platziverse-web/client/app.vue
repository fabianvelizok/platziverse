<template>
  <div>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
      :socket="socket"
    >
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const io = require('socket.io-client')
const request = require('request-promise-native')
const socket = io()

const { serverHost } = require('../config')

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      const options = {
        method: 'GET',
        url: `${serverHost}/agents`,
        json: true
      }

      let result
      try {
        result = await request(options)
      } catch (e) {
        this.error = e.error.error
        return
      }

      this.agents = result

      socket.on('agent/connected', payload => {
        const { uuid } = payload.agent
        const alreadyIncluded = this.agents.find(a => a.uuid === uuid)
        if (!alreadyIncluded) {
          this.agents.push(payload.agent)
        }
      })
    }
  }
}
</script>
