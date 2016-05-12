'use strict'

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// feathers libraries
const hooks = require('feathers-hooks')
const security = require('feathers-authentication')

const TABLE_NAME = 'administrators'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {
    // before create
    app.service(TABLE_NAME).before({
      create: function (self) {
        console.log(self.data)
        throw new Error('NEW ERROR')
      }
    })
  }
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
