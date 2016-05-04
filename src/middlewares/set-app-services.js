'use strict'

const debug = require('debug')('abibao:middleware:set-app-services')

module.exports = function (app) {
  return function (req, res, next) {
    debug('execute')
    req.services = req.app.services
    next()
  }
}
