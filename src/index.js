'use strict'

// load configurations
const nconf = require("nconf")
nconf.argv().env().file({ file: 'nconf-env.json' })

const feathers = require('feathers')
const bodyParser = require('body-parser')
const error = require('feathers-errors/handler')
const rest = require('feathers-rest')

const r = require('rethinkdbdash')({
  silent: true,
  port: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_PORT'),
  host: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_HOST'),
  authKey: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_AUTH_KEY'),
  db: nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_RETHINK_DB')
})
const service = require('feathers-rethinkdb')

// A Feathers app is the same as an Express app
const app = feathers()

app.configure(rest());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/surveys', service({
  Model: r,
  name: 'surveys'
}))

// Register a nicer error handler than the default Express one
app.use(error())

// Start the server
app.listen( nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_PORT'),  nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_IP'), function () {
  console.log('server started')
})
