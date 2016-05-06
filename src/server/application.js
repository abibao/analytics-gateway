'use strict'

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
const campaignsItemsChoices = require('./services/campaigns_items_choices')

// mysql services
const answers = require('./services/sql/answers')

// insert hooks

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

  // rethinkdb rest services
  app.use('/individuals', individuals)
  app.use('/surveys', surveys)
  app.use('/campaigns', campaigns)
  app.use('/entities', entities)
  app.use('/campaigns_items_choices', campaignsItemsChoices)

  // rethinkdb event services
  app.service('surveys').options.r.table('surveys').changes().run(function (err, cursor) {
    cursor.each(console.log)
  })

  // mysql rest services
  app.use('/answers', answers)

  // register a nicer error handler than the default express one
  app.use(error())

  return app
}
