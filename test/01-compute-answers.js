'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// use servicebus
const bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})

bus.send('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER_RECE', {
  id: '572baa513625270c00205e73'
})

/* bus.publish('BUS_EVENT_IS_ALIVE_RECE', {
  name: 'WTF APPLICATION',
  uuid: '123456789'
}) */
