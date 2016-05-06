'use strict'

// use new relic agent
require('newrelic')

// configure console debug
const debug = require('debug')('abibao:feather')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// use servicebus
const bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})
bus.listen('BUS_EVENT_ANALYTICS_IS_ALIVE', require('./bus/handlers/is_alive'))
bus.listen('BUS_EVENT_ANALYTICS_COMPUTE_ANSWERS', require('./bus/handlers/compute_answers'))
bus.listen('BUS_EVENT_ANALYTICS_INSERT_ANSWER', require('./bus/handlers/insert_answers'))

// externals libraries
const bodyParser = require('body-parser')

// feathers libraries
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const error = require('feathers-errors/handler')

// rethinkdb services
const individuals = require('./services/individuals')
const surveys = require('./services/surveys')
const campaigns = require('./services/campaigns')
const entities = require('./services/entities')

// mysql services
const answers = require('./services/sql/answers')

// feathers application
const app = feathers()

// configure
app.configure(rest())
app.configure(hooks())

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// rethinkdb rest services
app.use('/individuals', individuals)
app.use('/surveys', surveys)
app.use('/campaigns', campaigns)
app.use('/entities', entities)

// mysql rest services
app.use('/answers', answers)

// register a nicer error handler than the default express one
app.use(error())

// insert hooks

// start the server
app.listen(nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT'), nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP'), function () {
  debug('server started')
  bus.send('BUS_EVENT_ANALYTICS_IS_ALIVE', '')
})
