'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')

// rethinkdb connector
const r = require('rethinkdbdash')({
  silent: true,
  port: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_PORT'),
  host: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_HOST'),
  authKey: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  db: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_DB')
})
const Service = require('feathers-rethinkdb').Service

// constructor class
class Surveys extends Service {
  find (params) {
    super.find(params)
      .then(function (data) {
        console.log(data)
        _.map(data, function (item) {
          delete item.id
        })
        return data
      })
      .catch(function (error) {
        console.log(error)
        return error
      })
  }
}

// exports
module.exports = new Surveys({
  Model: r,
  name: 'surveys'
})
