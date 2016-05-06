'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// use servicebus
const bus = require('servicebus').bus({
  url: nconf.get('ABIBAO_ANALYTICS_GATEWAY_RABBITMQ_URL')
})

bus.send('BUS_EVENT_ANALYTICS_COMPUTE_ANSWERS', {
  id: '5728fc423dea810500da78d4'
})
