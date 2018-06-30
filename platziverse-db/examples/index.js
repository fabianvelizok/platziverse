'use strict'

const db = require('../')
const common = require('platziverse-common')
const config = Object.assign({}, common.db.config)

async function run() {
  const { Agent, Metric } = await db(config).catch(handleFatalError)

  let newAgent = {
    uuid: 'fff-fff-fff',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }

  const agent = await Agent.createOrUpdate(newAgent).catch(handleFatalError)

  console.log('--- agent ---')
  console.log(agent)

  //////////////////////
  
  const agents = await Agent.findAll().catch(handleFatalError)
  
  console.log('--- agents ---')
  console.log(agents)
  
  //////////////////////

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300'
  }).catch(handleFatalError)

  console.log('--- metric ---')
  console.log(metric)

  //////////////////////

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)

  console.log('--- metrics by agent uuid ---')
  console.log(metrics)

  //////////////////////

  const metricByType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError)

  console.log('--- metrics by type and agent uuid ---')
  console.log(metricByType)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

run()
