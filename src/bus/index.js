'use strict'

var Promise = require('bluebird')

var nconf = global.ABIBAO.nconf

var internals = {
  options: {
    url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
  },
  constants: { },
  events: {
    BUS_EVENT_IS_ALIVE: 'BUS_EVENT_IS_ALIVE' + '_' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_COMPUTE_ANSWER: 'BUS_EVENT_ANALYTICS_COMPUTE_ANSWER' + '_' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_ENV').toUpperCase(),
    BUS_EVENT_ANALYTICS_INSERT_ANSWER: 'BUS_EVENT_ANALYTICS_INSERT_ANSWER' + '_' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_ENV').toUpperCase()
  },
  bus: false
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.bus,
  error: global.ABIBAO.debuggers.error
}

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.bus = require('servicebus').bus(internals.options)
      internals.bus.listen(internals.events.BUS_EVENT_IS_ALIVE, require('./handlers/is_alive'))
      internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, require('./handlers/compute_answer'))
      internals.bus.listen(internals.events.BUS_EVENT_ANALYTICS_INSERT_ANSWER, require('./handlers/insert_answer'))
      resolve()
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.bus !== false) { resolve() }
    internals.bus = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.bus = internals.bus
        global.ABIBAO.events.BusEvent = internals.events
        global.ABIBAO.events.BusConstant = internals.constants
        abibao.debug(global.ABIBAO.events.BusEvent)
        resolve()
      })
      .catch(function (error) {
        internals.bus = false
        abibao.error(error)
        reject(error)
      })
  })
}
