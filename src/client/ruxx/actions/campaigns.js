function CampaignsActions (facade) {
  var self = this
  self.facade = facade

  self.create = function () {
    return new Promise(function (resolve, reject) {
      var data = {
        urnCompany: facade.getCurrentEntity().urn,
        name: 'Nouvelle campagne',
        position: facade.getCurrentEntity().campaigns.length + 1,
        screenWelcomeContent: '',
        screenThankYouContent: '',
        price: 0,
        currency: 'EUR',
        published: false,
        description: 'Veuillez saisir une description'
      }
      self.facade.setLoading(true)
      facade.call('POST', '/v1/campaigns', data).then(function (campaign) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.create %o', campaign)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.create (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.createItemDropdown = function () {
    return new Promise(function (resolve, reject) {
      var payload = {
        campaign: facade.getCurrentCampaign().urn,
        question: 'Quelle est la question ?',
        required: true,
        position: facade.getCurrentCampaign().items.length + 1,
        label: 'ABIBAO_ANSWER_',
        placeholder: 'Ceci est un placeholder'
      }
      facade.call('POST', '/v1/campaigns/items/dropdown', payload).then(function (item) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemDropdown %o', item)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemDropdown (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.createItemYesNo = function () {
    return new Promise(function (resolve, reject) {
      var payload = {
        campaign: facade.getCurrentCampaign().urn,
        question: 'Quelle est la question ?',
        required: true,
        position: facade.getCurrentCampaign().items.length + 1,
        label: 'ABIBAO_ANSWER_'
      }
      facade.call('POST', '/v1/campaigns/items/yes-no', payload).then(function (item) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemYesNo %o', item)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemYesNo (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.createItemMultipleChoice = function () {
    return new Promise(function (resolve, reject) {
      var payload = {
        campaign: facade.getCurrentCampaign().urn,
        question: 'Quelle est la question ?',
        required: true,
        position: facade.getCurrentCampaign().items.length + 1,
        label: 'ABIBAO_ANSWER_',
        multipleSelections: false,
        randomize: false,
        addCustomOption: false,
        alignment: 'horizontal'
      }
      facade.call('POST', '/v1/campaigns/items/multiple-choice', payload).then(function (item) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemMultipleChoice %o', item)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.createItemMultipleChoice (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.update = function (campaign) {
    return new Promise(function (resolve, reject) {
      var data = lodash.clone(campaign)
      delete data.createdAt
      delete data.modifiedAt
      delete data.urn
      delete data.items
      delete data.company
      self.facade.setLoading(true)
      facade.call('PATCH', '/v1/campaigns/' + campaign.urn, data).then(function (campaign) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.update %o', campaign)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.update (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.updateItem = function (item) {
    return new Promise(function (resolve, reject) {
      var data = lodash.clone(item)
      delete data.iconType
      delete data.createdAt
      delete data.modifiedAt
      delete data.urn
      delete data.company
      delete data.label
      delete data.type
      delete data.choices
      delete data.urnCampaign
      delete data.directive
      self.facade.setLoading(true)
      facade.call('PATCH', '/v1/campaigns/items/' + item.urn, data).then(function (item) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.updateItem %o', item)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.updateItem (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.updateItemChoice = function (choice) {
    return new Promise(function (resolve, reject) {
      var data = lodash.clone(choice)
      delete data.createdAt
      delete data.modifiedAt
      delete data.urn
      delete data.meta
      delete data.urnCampaign
      delete data.urnItem
      self.facade.setLoading(true)
      facade.call('PATCH', '/v1/choices/' + choice.urn, data).then(function (choice) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.updateItemChoice %o', choice)
        resolve()
      }).catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('CampaignsActions.updateItemChoice (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
    })
  }

  self.selectCampaign = function (urn) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/campaigns/' + urn)
        .then(function (campaign) {
          self.facade.debugAction('CampaignsActions.selectCampaign %o', campaign)
          self.facade.setLoading(false)
          facade.setCurrentCampaign(campaign)
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('CampaignsActions.selectCampaign (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.selectCampaignItem = function (urn) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/campaigns/items/' + urn)
        .then(function (item) {
          self.facade.debugAction('CampaignsActions.selectCampaignItem %o', item)
          self.facade.setLoading(false)
          facade.setCurrentCampaignItem(item)
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('CampaignsActions.selectCampaignItem (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.createCampaignItemChoice = function () {
    return new Promise(function (resolve, reject) {
      var data = {
        item: facade.getCurrentCampaignItem().urn,
        campaign: facade.getCurrentCampaign().urn,
        prefix: '_PREFIX_',
        suffix: '_SUFFIX_',
        text: 'Saisir le texte',
        position: facade.getCurrentCampaignItem().choices.length + 1
      }
      self.facade.setLoading(true)
      self.facade.call('POST', '/v1/choices', data)
        .then(function (item) {
          self.facade.debugAction('CampaignsActions.createCampaignItemChoice %o', item)
          self.facade.setLoading(false)
          facade.setCurrentCampaignItemChoice(item)
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('CampaignsActions.createCampaignItemChoice (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.selectCampaignItemChoice = function (urn) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/choices/' + urn)
        .then(function (item) {
          self.facade.debugAction('CampaignsActions.selectCampaignItemChoice %o', item)
          self.facade.setLoading(false)
          facade.setCurrentCampaignItemChoice(item)
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('CampaignsActions.selectCampaignItemChoice (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }
}
