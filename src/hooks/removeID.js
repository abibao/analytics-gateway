' use strict'

// feathers libraries
const hooks = require('feathers-hooks')

module.exports = function () {
  return {
    all: hooks.remove('id')
  }
}
