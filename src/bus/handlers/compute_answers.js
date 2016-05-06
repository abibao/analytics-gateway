'use strict'

// configure console debug
const debug = require('debug')('abibao:bus:compute_answers')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// use servicebus
const bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})

const _ = require('lodash')
const rp = require('request-promise')

module.exports = function (message) {
  // get survey in rethinkdb
  let options = {
    method: 'GET',
    uri: 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT') + '/surveys/' + message.id,
    json: true
  }
  rp(options)
    .then(function (data) {
      // compute answers
      _.mapKeys(data.answers, function (value, label) {
        if (_.isArray(value)) {
          _.map(value, function (_value) {
            let row = {}
            row.email = data.individualPopulate.email
            row.campaign_id = data.campaignPopulate.id
            row.campaign_name = data.campaignPopulate.name
            row.label = label
            row.value = _value
            bus.send('BUS_EVENT_ANALYTICS_INSERT_ANSWER', row)
          })
        } else {
          let row = {}
          row.email = data.individualPopulate.email
          row.campaign_id = data.campaignPopulate.id
          row.campaign_name = data.campaignPopulate.name
          row.label = label
          row.value = value
          bus.send('BUS_EVENT_ANALYTICS_INSERT_ANSWER', row)
        }
      })
    })
    .catch(function (error) {
      debug('error: %o', error)
    })
}
