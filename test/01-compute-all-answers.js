'use strict'

const async = require('async')
const _ = require('lodash')
const rp = require('request-promise')
const Hoek = require('hoek')
const Promise = require('bluebird')

// load configurations
const nconf = require('nconf')
nconf.argv().env().file({ file: 'nconf-deve.json' })

const gatewayURI = 'http://' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_IP') + ':' + nconf.get('ABIBAO_ANALYTICS_GATEWAY_EXPOSE_PORT')

let globalTotalRows = 0

const computeAnswers = function (data) {
  return new Promise(function (resolve, reject) {
    let optsCampaignsItemsChoicesGet = {
      method: 'GET',
      uri: gatewayURI + '/campaigns_items_choices',
      json: true
    }
    // compute answers
    let rows = []
    _.mapKeys(data.answers, function (value, label) {
      if (_.isArray(value)) {
        _.map(value, function (_value) {
          let row = {}
          row.email = data.individualPopulate.email
          row.campaign_id = data.campaignPopulate.id
          row.campaign_name = data.campaignPopulate.name
          row.charity_id = data.charityPopulate.id
          row.charity_name = data.charityPopulate.name
          row.question = label
          let opts = Hoek.clone(optsCampaignsItemsChoicesGet)
          opts.uri = opts.uri + '/' + _value
          rp(opts)
            .then(function (choice) {
              row.answer = choice.prefix + '_' + choice.suffix
              row.answer_text = choice.text
              rows.push(row)
            })
            .catch(function () {
              row.answer = _value
              rows.push(row)
            })
        })
        resolve(rows)
      } else {
        let row = {}
        row.email = data.individualPopulate.email
        row.campaign_id = data.campaignPopulate.id
        row.campaign_name = data.campaignPopulate.name
        row.charity_id = data.charityPopulate.id
        row.charity_name = data.charityPopulate.name
        row.question = label
        let opts = Hoek.clone(optsCampaignsItemsChoicesGet)
        opts.uri = opts.uri + '/' + value
        rp(opts)
          .then(function (choice) {
            row.answer = choice.prefix + '_' + choice.suffix
            row.answer_text = choice.text
            resolve(row)
          })
          .catch(function () {
            row.answer = value
            resolve(row)
          })
      }
    })
  })
}

const getSurveys = function (skip) {
  // get all surveys
  console.log('== [%s] ====================', new Date())
  let optsSurveysList = {
    method: 'GET',
    uri: gatewayURI + '/surveys?$skip=' + skip,
    json: true
  }
  rp(optsSurveysList)
    .then(function (surveys) {
      let key = 0
      async.mapLimit(surveys.data, 1, function (survey, next) {
        console.log('[skip %s] start %s', surveys.skip + key, survey.id)
        key += 1
        computeAnswers(survey)
          .then(function (answer) {
            next(null, answer)
          })
          .catch(function (error) {
            next(error)
          })
      }, function (error, answers) {
        if (error) {
          console.log(error)
          return
        }
        // insert all answers
        let optsAnswerCreate = {
          method: 'POST',
          uri: gatewayURI + '/answers',
          json: true
        }
        async.mapLimit(answers, 1, function (answer, next) {
          var opts = Hoek.clone(optsAnswerCreate)
          opts.body = answer
          rp(opts)
            .then(function (result) {
              if (_.isArray(result)) {
                globalTotalRows += result.length
                console.log('..................... %s answers', result.length)
              } else {
                globalTotalRows += 1
                console.log('.....[%s]............ 1 answer', answer.question)
              }
              next(null, result)
            })
            .catch(function (error) {
              next(error)
            })
        }, function (error, results) {
          if (error) {
            console.log(error)
            return
          }
          // continue or finish ?
          if ((surveys.skip + surveys.limit - 1) < surveys.total) {
            getSurveys(surveys.skip + surveys.limit)
          } else {
            console.log('== [%s] answers inserted ====================', globalTotalRows)
          }
        })
      })
    })
}

getSurveys(0)
