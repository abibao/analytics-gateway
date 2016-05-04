'use strict'

// use new relic agent
require('newrelic')

// configure console debug
const debug = require('debug')('abibao:feather')

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

// application services
const individuals = require('./services/individuals')
const surveys = require('./services/surveys')
const campaigns = require('./services/campaigns')
const entities = require('./services/entities')
const sqlAnswers = require('./services/sql/answers')

// application hooks

// application middlewares
const filterAnswers = require('./middlewares/filter-answers')
const insertAnswers = require('./middlewares/insert-answers')
const setApplicationServices = require('./middlewares/set-app-services')

// feathers application
const app = feathers()

// configure
app.configure(rest())
app.configure(hooks())

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// rest services
app.use('/individuals', individuals)
app.use('/surveys', surveys)
app.use('/campaigns', campaigns)
app.use('/entities', entities)
app.use('/sql_answers', sqlAnswers)

// analytics services
app.use('/batchs/answers', setApplicationServices(app), surveys, filterAnswers, insertAnswers)

// register a nicer error handler than the default express one
app.use(error())

// insert hooks

// start the server
app.listen(nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT'), nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP'), function () {
  debug('server started')
})
