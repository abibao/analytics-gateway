'use strict'

const debug = require('debug')('abibao:batch:compute_all_answers')

const surveys = require('./bin/surveys')

// let's found all the answers
debug('== [%s] ====================', new Date())
surveys.list()
  .then(function (result) {
    debug('== [DONE] ==================== %s surveys', result.length)
  })
  .catch(function (error) {
    debug('== [ERROR] ==================== %o', new Date(), error)
  })
