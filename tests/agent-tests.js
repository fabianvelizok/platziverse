'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')

let db = null
let sandbox = null
let config = {
  logging: function () { }
}

// Mock single agent and id
const id = 1
const single = Object.assign({}, agentFixtures.single)

// Model representations
let MetricStub = {
  belongsTo: sinon.spy()
}
let AgentStub = null

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create()

  // Get a clean instance before each
  AgentStub = {
    hasMany: sandbox.spy()
  }
  
  // Model: Add findById stub
  AgentStub.findById = sandbox.stub()
  // Hey fake function, when I call you with 'x' argument, you have to return 'y'.
  AgentStub.findById.withArgs(id).returns(
    Promise.resolve(agentFixtures.findById(id))
  )

  // Rewrite requires
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.sandbox.restore()
})

test('Agent', (t) => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', (t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany should be executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricStub')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo should be executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentStub')
})

test.serial('Setup#findById', async (t) => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with right id')
  t.deepEqual(agent, agentFixtures.findById(id), 'Results should be the same')
})
