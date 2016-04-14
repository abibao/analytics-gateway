'use strict'

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// feathers libraries
const hooks = require('feathers-hooks')

// application libraries
const hookAfterURN = require('./../hooks/setURN')
const hookAfterID = require('./../hooks/removeID')

const TABLE_NAME = 'surveys'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {
    app.service(TABLE_NAME).after(hooks.populate('campaign', {
      service: 'campaigns',
      field: 'campaign'
    }))
    app.service(TABLE_NAME).after(hooks.populate('company', {
      service: 'entities',
      field: 'company'
    }))
    app.service(TABLE_NAME).after(hooks.populate('individual', {
      service: 'individuals',
      field: 'individual'
    }))
    app.service(TABLE_NAME).after(hookAfterURN())
    app.service(TABLE_NAME).after(hookAfterID())
  }
}

// exports
module.exports = new Service({
  Model: Rethinkdb.r,
  name: TABLE_NAME
})
