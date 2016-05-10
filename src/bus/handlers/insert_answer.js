'use strict'

var Hoek = require('hoek')

module.exports = function (message) {
  var answers = Hoek.clone(global.ABIBAO.services.server.service('answers'))
  // check if exists ?
  var params = {
    query: {
      email: message.email,
      campaign_id: message.campaign_id,
      question: message.question,
      answer: message.answer
    }
  }
  answers.find(params)
    .then(function (results) {
      global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER find: %s %s [%s]', message.email, message.campaign_id, results.data.length)
      if (results.data.length === 0) {
        // insert answer in mysql
        answers.create(message)
          .then(function () {
            // global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER insert: %o', result)
          })
          .catch(function () {
            // global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER insert error: %o', error)
          })
      } else {
      }
    })
    .catch(function (s) {
      // global.ABIBAO.debuggers.bus('BUS_EVENT_ANALYTICS_INSERT_ANSWER find error: %o', error)
    })
}
