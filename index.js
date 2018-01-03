'use strict';

const setupDatabase = require('./lib/db');
const setupAgentModel = require('./models/agent');
const setupMetricModel = require('./models/metric');

module.exports = async function (config) {
  const sequelize = setupDatabase(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  await sequelize.authenticate();

  if (config.setup) await sequelize.sync({ force: true });

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  const agent = {};
  const metric = {};

  return {
    agent,
    metric,
  };
};
