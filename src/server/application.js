'use strict'

// externals libraries
const path = require('path')
const bodyParser = require('body-parser')

// feathers libraries
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const authentication = require('feathers-authentication')
const error = require('feathers-errors/handler')

// rethinkdb services
const administrators = require('./services/rethinkdb/administrators')
const individuals = require('./services/rethinkdb/individuals')
const surveys = require('./services/rethinkdb/surveys')
const campaigns = require('./services/rethinkdb/campaigns')
const entities = require('./services/rethinkdb/entities')
const campaignsItems = require('./services/rethinkdb/campaigns_items')
const campaignsItemsChoices = require('./services/rethinkdb/campaigns_items_choices')

// mysql services
const answers = require('./services/mysql/answers')
const statistics = require('./services/mysql/statistics')

// batchs services
const batchsComputeAnswers = require('./services/batchs/compute-answers')

// export server
module.exports = function () {
  // feathers application
  let app = feathers()

  // configure
  app.configure(rest())
  app.configure(hooks())

  // middlewares
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // security
  app.configure(authentication({
    local: false,
    token: {
      secret: global.ABIBAO.nconf.get('ABIBAO_ANALYTICS_GATEWAY_AUTHENTIFICATION_TOKEN'),
      payload: ['id', 'email']
    }
  }))

  // rethinkdb services
  app.use('/administrators', administrators)
  app.use('/individuals', individuals)
  app.use('/surveys', surveys)
  app.use('/campaigns', campaigns)
  app.use('/entities', entities)
  app.use('/campaigns_items', campaignsItems)
  app.use('/campaigns_items_choices', campaignsItemsChoices)

  // mysql services
  app.use('/answers', answers)
  app.use('/statistics', statistics)

  // batchs services
  app.get('/batchs/computes/answers', batchsComputeAnswers)

  // static
  app.use('/', feathers.static(path.resolve(__dirname, '../client')))

  // register a nicer error handler than the default express one
  app.use(error())

  return app
}
