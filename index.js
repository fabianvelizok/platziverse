'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    query: {
      raw: true,
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  await sequelize.authenticate()

  if (config.setup) {
    // Sync db
    await sequelize.sync({ force: true })
  }

  // Build relationships
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  const agent = {}
  const metric = {}

  return {
    agent,
    metric,
  }
}