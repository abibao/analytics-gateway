'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// mysql connector
const db = require('knex')({
  client: 'mysql',
  connection: {
    host: nconf.get('ABIBAO_ANALYTICS_GATEWAY_SERVER_MYSQL_HOST'),
    port: nconf.get('ABIBAO_ANALYTICS_GATEWAY_SERVER_MYSQL_PORT'),
    user: nconf.get('ABIBAO_ANALYTICS_GATEWAY_SERVER_MYSQL_USER'),
    password: nconf.get('ABIBAO_ANALYTICS_GATEWAY_SERVER_MYSQL_PASSWORD'),
    database: nconf.get('ABIBAO_ANALYTICS_GATEWAY_SERVER_MYSQL_DATABASE')
  }
})
const Service = require('feathers-knex')

module.exports.db = db
module.exports.Service = Service
