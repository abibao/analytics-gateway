'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')
const bodyParser = require('body-parser')

// feathers libraries
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const error = require('feathers-errors/handler')

// application services
const individuals = require('./services/individuals')
const surveys = require('./services/surveys')
const campaigns = require('./services/campaigns')
const entities = require('./services/entities')

// application hooks
const hookAfterURN = require('./hooks/setURN')
const hookAfterID = require('./hooks/removeID')

// feathers application
const app = feathers()

// configure
app.configure(rest())
app.configure(hooks())

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// services
app.use('/individuals', individuals)
app.use('/surveys', surveys)
app.use('/campaigns', campaigns)
app.use('/entities', entities)

// register a nicer error handler than the default express one
app.use(error())

// insert hooks
_.mapKeys(app.services, function (service) {
  let key = service.options.name
  app.service(key).after(hookAfterURN())
  app.service(key).after(hookAfterID())
})

// start the server
app.listen(nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_PORT'), nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_IP'), function () {
  console.log('server started')
})
