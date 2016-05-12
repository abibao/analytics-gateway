'use strict'

const debug = require('debug')('abibao:batch:bin_get_surveys')
const Promise = require('bluebird')
const rp = require('request-promise')
const _ = require('lodash')
const Hoek = require('hoek')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const gatewayURI = 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT')

const internals = {}

internals.run = function (skip, limit, data, currentPercent, resolve, reject, callback) {
  debug('skip=%s limit=%s', skip, limit)
  let optsSurveysList = {
    method: 'GET',
    uri: gatewayURI + '/surveys?$skip=' + skip + '&$limit=' + limit,
    json: true
  }
  rp(optsSurveysList)
    .then(function (result) {
      currentPercent = 100 * (data.length / result.total)
      _.merge(data, result.data)
      debug('currentPercent=%s% / data.count=%s', currentPercent, data.length)
      if (currentPercent < 100) {
        let __function = Hoek.clone(internals.run)
        let __callback = Hoek.clone(internals.run)
        __function(skip + limit, limit, data, currentPercent, resolve, reject, __callback)
      } else {
        resolve(data)
      }
    })
    .catch(function (error) {
      reject(error)
    })
}

module.exports.list = function () {
  return new Promise(function (resolve, reject) {
    let __function = Hoek.clone(internals.run)
    let __callback = Hoek.clone(internals.run)
    __function(0, 20, [], 0, resolve, reject, __callback)
  })
}
