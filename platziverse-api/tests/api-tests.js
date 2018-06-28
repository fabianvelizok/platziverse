'use strict'

const test = require('ava')   
const request = require('supertest') // Supertest works with callbacks

const server = require('..')

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'It should not return an error')
      let body = res.body
      t.deepEqual(body, {}, 'Body should be expected')
      t.end()
    })
})
