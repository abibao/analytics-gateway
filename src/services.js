'use strict'

/*
====================================================
ROLES
====================================================
  - return all singletons
====================================================
*/

var Promise = require('bluebird')

module.exports.bus = function () {
  return new Promise(function (resolve, reject) {
    require('./bus').singleton()
      .then(function (item) {
        resolve(item)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

module.exports.server = function () {
  return new Promise(function (resolve, reject) {
    require('./server').singleton()
      .then(function (item) {
        resolve(item)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
