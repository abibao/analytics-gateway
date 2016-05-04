'use strict'

const debug = require('debug')('abibao:middleware:insert-answers')
const _ = require('lodash')

module.exports = function (req, res, next) {
  debug('execute')
  _.map(res.data, function (item) {
    req.services.sql_answers.create(item)
      .then(function () {
        debug('item %s created in MySQL', item.id)
      })
  })
  next()
}
