'use strict'

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

exports.config = {
  app_name: [nconf.get('ABIBAO_ANALYTICS_GATEWAY_NEWRELIC_APPNAME')],
  license_key: '06d749121c1e4356b0ee9a6c265dd48642acaeec',
  logging: {
    level: 'info'
  }
}
