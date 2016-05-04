'use strict'

// internals libraries
const MySQL = require('./../../contructors/services/mysql')

// feathers libraries
const hooks = require('feathers-hooks')

const TABLE_NAME = 'answers'

// constructor class
class Service extends MySQL.Service {
  setup (app) {}
}

// exports
module.exports = new Service({
  Model: MySQL.db,
  name: TABLE_NAME
})
