'use strict'

Object.prototype.extends = function (params = {}) {
  const newObj = Object.assign({}, this, params)
  return newObj
}

const agent = {
  id: 1,
  uuid: 'xxx-xxx-xxx',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  agent.extends({ id: 2, uuid: 'yyy-yyy-yyy', connected: false, username: 'test' }),
  agent.extends({ id: 3, uuid: 'zzz-zzz-zzz' }),
  agent.extends({ id: 4, uuid: 'xyz-xyz-xyz', username: 'test' }),
]

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  findByUuid: uuid => agents.find(a => a.uuid === uuid),
  findById: id => agents.find(a => a.id === id)
}
