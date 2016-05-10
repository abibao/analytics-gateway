'use strict'

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// feathers libraries
const hooks = require('feathers-hooks')

const TABLE_NAME = 'individuals'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {}
}

// exports
module.exports = new Service({
  Model: Rethinkdb.r,
  name: TABLE_NAME,
  paginate: {
    default: 10,
    max: 20
  }
})
