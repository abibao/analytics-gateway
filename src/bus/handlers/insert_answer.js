'use strict'

const rp = require('request-promise')

const nconf = global.ABIBAO.nconf

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER %o', message)
  // insert answer in mysql
  let options = {
    method: 'POST',
    uri: 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT') + '/answers',
    body: message,
    json: true
  }
  rp(options)
    .then(function (data) {
      global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER %o', data)
    })
    .catch(function (error) {
      global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER error: %o', error)
    })
}
