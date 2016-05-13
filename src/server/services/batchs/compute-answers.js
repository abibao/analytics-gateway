'use strict'

const Hoek = require('hoek')
const errors = require('feathers-errors')

// use debuggers reference
const abibao = {
  debug: global.ABIBAO.debuggers.server,
  error: global.ABIBAO.debuggers.error
}

module.exports = function (req, res, next) {
  let server = global.ABIBAO.services.server
  let bus = global.ABIBAO.services.bus
  var surveys = Hoek.clone(server.service('surveys'))
  surveys.find({
    query: {
      $sort: 'modifiedAt',
      $skip: 0,
      $limit: 10
    }
  })
    .then(function (result) {
      bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, result)
      res.send({
        started: true,
        total: result.total
      })
    })
    .catch(function (error) {
      let message = new errors.GeneralError(error)
      abibao.error(message)
      res.send(message)
    })
}
