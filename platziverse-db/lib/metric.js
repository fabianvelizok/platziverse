'use strict'

module.exports = function setupAgent(MetricModel, AgentModel) {
  async function findByAgentUuid(uuid) {
    const q = {
      attributes: ['type'], // Like a select
      group: ['type'],
      include: [{ // Join
        attributes: [],
        model: AgentModel,
        where: { uuid }
      }],
      raw: true // Global config doesn't work with joins.
    }

    return MetricModel.findAll(q)
  }

  async function findByTypeAgentUuid (type, uuid) {
    const q = {
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: { type },
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: {
        attributes: [],
        model: AgentModel,
        where: { uuid }
      },
      raw: true
    }

    return MetricModel.findAll(q)
  }

  async function create(agentUuid, metric) {
    const agent = await AgentModel.findOne({
      where: { uuid: agentUuid }
    })

    if (agent) {
      Object.assign(metric, { agentId: agent.id })
      const result = await MetricModel.create(metric)
      return result.toJSON()
    }
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}
