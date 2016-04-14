'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const bodyParser = require('body-parser')

// feathers libraries
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const error = require('feathers-errors/handler')

// application libraries
const individuals = require('./services/individuals')
const surveys = require('./services/surveys')
const campaigns = require('./services/campaigns')
const entities = require('./services/entities')

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

// start the server
app.listen(nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_PORT'), nconf.get('ABIBAO_SERVICES_GATEWAY_EXPOSE_IP'), function () {
  console.log('server started')
  console.log(app.services)
})
