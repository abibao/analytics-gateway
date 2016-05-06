'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// use servicebus
const bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})

bus.send('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER_DEVE', {
  id: '57271fda20582d38639062fb'
})
