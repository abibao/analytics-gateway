'use strict'

// configure console debug
const debug = require('debug')('abibao:bus:is_alive')

module.exports = function (message) {
  debug('rabbitmq is alive')
}
