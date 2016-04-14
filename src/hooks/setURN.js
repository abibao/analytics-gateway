'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

// externals libraries
const _ = require('lodash')
const Cryptr = require('cryptr')

module.exports = function () {
  let cryptr = new Cryptr(nconf.get('ABIBAO_SERVICES_GATEWAY_SERVER_AUTH_JWT_KEY'))
  return {
    find(hook) {
      _.map(hook.result, function (item) {
        item.urn = 'urn:abibao:database:' + cryptr.encrypt(item.id)
      })
    },
    get(hook) {
      console.log(hook.params)
      var item = hook.result
      item.urn = 'urn:abibao:database:' + cryptr.encrypt(item.id)
    }
  }
}
