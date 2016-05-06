'use strict'

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// feathers libraries
const hooks = require('feathers-hooks')

const TABLE_NAME = 'surveys'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {
    app.service(TABLE_NAME).after(hooks.populate('campaignPopulate', {
      service: 'campaigns',
      field: 'campaign'
    }))
    app.service(TABLE_NAME).after(hooks.populate('companyPopulate', {
      service: 'entities',
      field: 'company'
    }))
    app.service(TABLE_NAME).after(hooks.populate('charityPopulate', {
      service: 'entities',
      field: 'charity'
    }))
    app.service(TABLE_NAME).after(hooks.populate('individualPopulate', {
      service: 'individuals',
      field: 'individual'
    }))
  }
}

// exports
module.exports = new Service({
  Model: Rethinkdb.r,
  name: TABLE_NAME
})
