'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// feathers libraries
const hooks = require('feathers-hooks');

const TABLE_NAME = 'individuals'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {
    app.service(TABLE_NAME).before(hooks.disable('external'))
  }
}

// exports
module.exports = new Service({
  Model: Rethinkdb.r,
  name: TABLE_NAME
})
