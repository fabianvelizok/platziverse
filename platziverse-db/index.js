'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('longjohn')
}

const defaults = require('defaults')
const setupAgent = require('./lib/agent')
const setupAgentModel = require('./models/agent')
const setupDatabase = require('./lib/db')
const setupMetric = require('./lib/metric')
const setupMetricModel = require('./models/metric')
const Sequelize = require('sequelize')

module.exports = async function (config) {
  const Op = Sequelize.Op

  config = defaults(config, {
    operatorsAliases: Op, // use Sequelize.Op
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  // Build relationships
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    // Sync db
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
