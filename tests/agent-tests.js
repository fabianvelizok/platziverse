'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

let db = null
let sandbox = null
let config = {
  logging: function () { }
}

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
  t.truthy(db.agent, 'Agent service should exist')
})

test.serial('Setup', (t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricStub')
  t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentStub')
})
