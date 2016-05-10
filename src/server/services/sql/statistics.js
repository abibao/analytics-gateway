'use strict'

// internals libraries
const MySQL = require('./../../contructors/services/mysql')

const TABLE_NAME = 'statistics'

// constructor class
class Service extends MySQL.Service {
  setup (app) {}
}

// exports
module.exports = new Service({
  Model: MySQL.db,
  name: TABLE_NAME
})
