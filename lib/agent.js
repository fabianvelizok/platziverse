'use strict'

module.exports = function setupAgent(AgentModel) {
  function findById(id) {
    return AgentModel.findById(id)
  }

  async function createOrUpdate(agent) {
    // return AgentModel.createOrUpdate(agent)
    const condition = {
      where: { uuid : agent.uuid }
    }

    const savedAgent = await AgentModel.findOne(condition)

    if (savedAgent) {
      const updatedAgent = await AgentModel.update(agent, condition)
      return updatedAgent ?
        AgentModel.findOne(condition) : savedAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  return {
    findById,
    createOrUpdate
  }
}
