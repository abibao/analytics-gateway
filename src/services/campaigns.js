'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

const TABLE_NAME = 'campaigns'

// constructor class
class Service extends Rethinkdb.Service {
  setup (app) {

  }
}

// exports
module.exports = new Service({
  Model: Rethinkdb.r,
  name: TABLE_NAME
})
