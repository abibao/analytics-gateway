'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// mysql connector
const db = require('knex')({
  client: 'mysql',
  connection: {
    host: '172.17.0.4',
    user: '**ChangeMe**',
    password: '**ChangeMe**',
    database: 'abibao'
  }
})
const Service = require('feathers-knex')

module.exports.db = db
module.exports.Service = Service
