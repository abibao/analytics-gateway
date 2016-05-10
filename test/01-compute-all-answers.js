'use strict'

var _ = require('lodash')
var rp = require('request-promise')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

var bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})

var getSurveys = function (skip) {
  // get all surveys
  var options = {
    method: 'GET',
    uri: 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT') + '/surveys?$skip=' + skip,
    json: true
  }
  rp(options)
    .then(function (surveys) {
      _.map(surveys.data, function (survey, key) {
        console.log('[skip %s] start %s', surveys.skip + key, survey.id)
        bus.send('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER_RECE', {
          id: survey.id
        })
      })
    })
}

getSurveys(0)
