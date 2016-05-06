'use strict'

/*
====================================================
ROLES
====================================================
  - initialize application in node global
  - initialize debuggers
  - initialize loggers
  - initialize services loaders
====================================================
*/

// load environnement configuration
var nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// initialize global.ABIBAO
global.ABIBAO = {
  starttime: new Date(),
  uuid: require('node-uuid').v4(),
  nconf: nconf,
  services: { },
  events: {
    BusEvent: { },
    ServerEvent: {}
  },
  constants: {
    BusConstant: { },
    ServerConstant: { }
  },
  debuggers: {
    error: require('debug')('abibao:error'),
    application: require('debug')('abibao:application'),
    bus: require('debug')('abibao:bus'),
    server: require('debug')('abibao:server')
  }
}

// use new relic agent
require('newrelic')

// use debuggers reference
var abibao = {
  debug: global.ABIBAO.debuggers.application,
  error: global.ABIBAO.debuggers.error
}

abibao.debug('start processing')

// start all services
var services = require('./services')
services.bus()
  .then(function (item) {
    abibao.debug('bus initialized')
    return services.server()
      .then(function () {
        abibao.debug('server initialized')
        abibao.debug('end processing')
        global.ABIBAO.services.server.listen(nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT'), nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP'), function () {
          abibao.debug('server has just started')
          global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_IS_ALIVE, 'rabbitmq is alive')
        })
      })
  })
  .catch(function (error) {
    abibao.error(error)
  })
