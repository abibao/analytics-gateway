'use strict'

const _ = require('lodash')

module.exports = function (message) {
  global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER %o', message)
  var surveys = global.ABIBAO.services.server.service('surveys')
  var campaignsItemsChoices = global.ABIBAO.services.server.service('campaigns_items_choices')
  // get survey in rethinkdb
  surveys.get(message.id)
    .then(function (data) {
      // compute answers
      _.mapKeys(data.answers, function (value, label) {
        if (_.isArray(value)) {
          _.map(value, function (_value) {
            let row = {}
            row.email = data.individualPopulate.email
            row.campaign_id = data.campaignPopulate.id
            row.campaign_name = data.campaignPopulate.name
            row.question = label
            campaignsItemsChoices.get(_value)
              .then(function (choice) {
                row.answer = choice.prefix + '_' + choice.suffix
                row.answer_text = choice.text
                global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_INSERT_ANSWER, row)
              })
              .catch(function () {
                row.answer = _value
                global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_INSERT_ANSWER, row)
              })
          })
        } else {
          let row = {}
          row.email = data.individualPopulate.email
          row.campaign_id = data.campaignPopulate.id
          row.campaign_name = data.campaignPopulate.name
          row.question = label
          campaignsItemsChoices.get(value)
            .then(function (choice) {
              row.answer = choice.prefix + '_' + choice.suffix
              row.answer_text = choice.text
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_INSERT_ANSWER, row)
            })
            .catch(function () {
              row.answer = value
              global.ABIBAO.services.bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_INSERT_ANSWER, row)
            })
        }
      })
    })
    .catch(function (error) {
      global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_COMPUTE_ANSWER error: %o', error)
    })
}
