'use strict'

module.exports = function setupAgent (AgentModel) {
  function findById (id) {
    return AgentModel.findById(id)
  }

  async function createOrUpdate (agent) {
    // return AgentModel.createOrUpdate(agent)
    const condition = {
      where: { uuid: agent.uuid }
    }

    const savedAgent = await AgentModel.findOne(condition)

    if (savedAgent) {
      const updatedAgent = await AgentModel.update(agent, condition)
      return updatedAgent
        ? AgentModel.findOne(condition) : savedAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}
