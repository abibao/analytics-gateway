'use strict'

const debug = require('debug')('abibao:middleware:filter-answers')
const _ = require('lodash')
const uuid = require('node-uuid')

module.exports = function (req, res, next) {
  debug('execute')
  let rows = []
  // data refactoring
  _.map(res.data, function (item) {
    _.mapKeys(item.answers, function (values, label) {
      let row = {}
      if (_.isArray(values)) {
        _.map(values, function (value) {
          row.id = uuid.v4()
          row.individuals = item.individual
          row.campaign = item.campaign
          row.label = label
          row.value = value
          rows.push(row)
        })
      } else {
        row.id = uuid.v4()
        row.individual = item.individual
        row.campaign = item.campaign
        row.label = label
        row.value = values
        rows.push(row)
      }
    })
  })
  res.data = rows
  next()
}
