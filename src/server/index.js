'use strict'

var Promise = require('bluebird')

var Application = require('./application')

var nconf = global.ABIBAO.nconf

var internals = {
  options: {
    host: nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP'),
    port: nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT')
  },
  events: { },
  constants: { }
}

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.server,
  error: global.ABIBAO.debuggers.error
}

internals.initialize = function () {
  abibao.debug('start initializing')
  return new Promise(function (resolve, reject) {
    try {
      internals.server = Application()
      resolve()
    } catch (error) {
      abibao.error(error)
      reject(error)
    }
  })
}

module.exports.singleton = function () {
  return new Promise(function (resolve, reject) {
    if (internals.server !== false) { resolve() }
    internals.server = { }
    internals.initialize()
      .then(function () {
        global.ABIBAO.services.server = internals.server
        global.ABIBAO.events.ServerEvent = internals.events
        global.ABIBAO.constants.ServerConstant = internals.constants
        resolve()
      })
      .catch(function (error) {
        internals.server = false
        abibao.error(error)
        reject(error)
      })
  })
}
