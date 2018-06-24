# Platziverse-agent

## Usage

```js
const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
  name: 'myapp',
  username: 'admin',
  interval: 2000
})

agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// For me
agent.on('message', handlerFunction)
agent.on('connected', handlerFunction)
agent.on('disconnected', handlerFunction)

// For other agents
agent.on('agent/connected', handlerFunction)
agent.on('agent/disconnected', handlerFunction)
agent.on('agent/message', payload => {
  console.log(payload)
})

setTimeout(() => agent.disconnect(), 20000)
```
