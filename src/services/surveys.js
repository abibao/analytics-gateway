'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')

// internals libraries
const Rethinkdb = require('./../contructors/services/rethinkdb')

// constructor class
class Surveys extends Rethinkdb.Service {
  setup (app) {
    app.service('surveys').before({
      find(hook) {
        console.log('surveys hook find before')
      }
    }),
    app.service('surveys').after({
      find(hook) {
        console.log('surveys hook find after')
        hook.result = _.map(hook.result, function (item) {
          delete item.id
          return item
        })
      }
    })
  }
}

// exports
module.exports = new Surveys({
  Model: Rethinkdb.r,
  name: 'surveys'
})
