function EntitiesActions (facade) {
  var self = this
  self.facade = facade

  self.update = function (entity) {
    //
    var data = lodash.clone(entity)
    delete data.createdAt
    delete data.modifiedAt
    delete data.urn
    delete data.campaigns
    //
    data.title = data.title || 'New title...'
    data.hangs = data.hangs || 'New hangs...'
    data.description = data.description || 'New description...'
    //
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('PATCH', '/v1/entities/' + entity.urn, data)
        .then(function (entity) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.update %o', entity)
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.populateCampaigns (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.selectCharity = function (urn) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/entities/' + urn)
        .then(function (charity) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.selectCharity %o', charity)
          facade.setCurrentEntity(charity)
          resolve()
        })
    })
  }
  self.selectEntity = function (urn) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/entities/' + urn)
        .then(function (entity) {
          self.facade.debugAction('EntitiesActions.selectEntity %o', entity)
          self.populateCampaigns(entity)
            .then(function (campaigns) {
              self.facade.setLoading(false)
              entity.campaigns = lodash.sortBy(campaigns, ['position', 'name'])
              facade.setCurrentEntity(entity)
              resolve()
            })
            .catch(function (error) {
              self.facade.setLoading(false)
              reject(error)
            })
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.selectEntity (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.list = function () {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/entities')
        .then(function (entities) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.list %o', entities)
          self.facade.stores.entities.charities = lodash.filter(entities, function (item) {
            return (item.type === 'charity')
          })
          self.facade.stores.entities.companies = lodash.filter(entities, function (item) {
            return (item.type === 'company' || item.type === 'abibao')
          })
          resolve()
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.list (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }

  self.populateCampaigns = function (entity) {
    return new Promise(function (resolve, reject) {
      self.facade.setLoading(true)
      self.facade.call('GET', '/v1/entities/' + entity.urn + '/campaigns')
        .then(function (campaigns) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.populateCampaigns %o', campaigns)
          resolve(campaigns)
        })
        .catch(function (error) {
          self.facade.setLoading(false)
          self.facade.debugAction('EntitiesActions.populateCampaigns (ERROR) %o', error)
          self.facade.trigger('EVENT_CALLER_ERROR', error)
          reject(error)
        })
    })
  }
}
