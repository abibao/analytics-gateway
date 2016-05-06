'use strict'

// configure console debug
const debug = require('debug')('abibao:bus:compute_answers')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const rp = require('request-promise')

module.exports = function (message) {
  // insert answer in mysql
  let options = {
    method: 'POST',
    uri: 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT') + '/answers',
    body: message,
    json: true
  }
  rp(options)
    .then(function (data) {
      debug(data)
    })
    .catch(function (error) {
      debug('error: %o', error)
    })
}
