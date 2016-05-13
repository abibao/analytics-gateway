'use strict'

const async = require('async')
const _ = require('lodash')
const Hoek = require('hoek')

const errors = require('feathers-errors')

// use debuggers reference
const logger = {
  debug: global.ABIBAO.debuggers.bus,
  error: global.ABIBAO.debuggers.error
}

const computeAnswersAsync = function (data) {
  let server = global.ABIBAO.services.server
  let campaignsItemsChoicesGetAsync = async.asyncify(server.service('campaigns_items_choices').get)
  // compute answers
  let rows = []
  _.mapKeys(data.answers, function (value, label) {
    if (_.isArray(value)) {
      logger.debug('............... MULTI label=%s', label)
      _.map(value, function (_value) {
        let row = {}
        row.email = data.individualPopulate.email
        row.campaign_id = data.campaignPopulate.id
        row.campaign_name = data.campaignPopulate.name
        row.charity_id = data.charityPopulate.id
        row.charity_name = data.charityPopulate.name
        row.question = label
        try {
          let choice = campaignsItemsChoicesGetAsync(_value)
          console.log(choice)
        } catch(e) {
          console.log(e)
        }
      /* if (error) {
        logger.debug('.................... catch(multi)')
        row.answer = _value
        rows.push(row)
      } else {
        logger.debug('.................... then(multi)')
        row.answer = choice.prefix + '_' + choice.suffix
        row.answer_text = choice.text
        rows.push(row)
      } */
      })
    } else {
      logger.debug('............... SINGLE label=%s', label)
      let row = {}
      row.email = data.individualPopulate.email
      row.campaign_id = data.campaignPopulate.id
      row.campaign_name = data.campaignPopulate.name
      row.charity_id = data.charityPopulate.id
      row.charity_name = data.charityPopulate.name
      row.question = label
      try {
        let choice = campaignsItemsChoicesGetAsync(value)
        console.log(choice)
      } catch(e) {
        console.log(e)
      }
    /* if (error) {
      logger.debug('.................... catch(single)')
      row.answer = value
      rows.push(row)
    } else {
      logger.debug('.................... then(single)')
      row.answer = choice.prefix + '_' + choice.suffix
      row.answer_text = choice.text
      rows.push(row)
    } */
    }
  })
  return rows
}

module.exports = function (surveys) {
  const globalSkip = surveys.skip
  const globalLimit = surveys.limit
  logger.debug('')
  logger.debug('================================================================')
  logger.debug('[BUS_EVENT_ANALYTICS_COMPUTE_ANSWER] skip=%s limit=%s -- start %s surveys', globalSkip, globalLimit, surveys.data.length)
  logger.debug('================================================================')
  if (surveys.data.length === 0) {
    return logger.debug('[BUS_EVENT_ANALYTICS_COMPUTE_ANSWER] no more answers')
  }
  // batch
  let key = surveys.skip
  async.mapLimit(surveys.data, 5, function (survey, next) {
    logger.debug('..... [%s] survey n°%s', survey.id, surveys.skip + key)
    key += 1
    let answers = computeAnswersAsync(survey)
    logger.debug('.......... [%s] survey with %o answers', survey.id, answers.length)
    let serviceAnswers = Hoek.clone(global.ABIBAO.services.server.service('answers'))
    serviceAnswers.create(answers)
    next()
  }, function (error, result) {
    if (error) {
      let message = new errors.GeneralError(error)
      logger.debug('[BUS_EVENT_ANALYTICS_COMPUTE_ANSWER] ERROR %o', message)
      return
    }
    // then re'run batch
    let server = global.ABIBAO.services.server
    let bus = global.ABIBAO.services.bus
    let surveys = Hoek.clone(server.service('surveys'))
    surveys.find({
      query: {
        $sort: 'modifiedAt',
        $skip: globalSkip + globalLimit,
        $limit: globalLimit
      }
    })
      .then(function (result) {
        logger.debug('[BUS_EVENT_ANALYTICS_COMPUTE_ANSWER] end')
        bus.send(global.ABIBAO.events.BusEvent.BUS_EVENT_ANALYTICS_COMPUTE_ANSWER, result)
      })
      .catch(function (error) {
        let message = new errors.GeneralError(error)
        logger.debug('[BUS_EVENT_ANALYTICS_COMPUTE_ANSWER] ERROR %o', message)
      })
  })
}
