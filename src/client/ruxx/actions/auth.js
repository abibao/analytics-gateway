function AuthActions (facade) {
  var self = this
  self.facade = facade

  self.logout = function () {
    Cookies.remove('Authorization')
    riot.route('/homepage')
  }

  self.login = function (payload) {
    return new Promise(function (resolve, reject) {
      feathers.authenticate({
        type: 'token',
        email: payload.email,
        password: payload.password
      }).then(function (result) {
        console.log('Authenticated!', app.get('token'))
        resolve()
      }).catch(function (error) {
        console.error('Error authenticating!', error)
        reject()
      })
    })
  /*
  return new Promise(function (resolve, reject) {
    self.facade.setLoading(true)
    self.facade.call('POST', '/administrators/login', payload)
      .then(function (user) {
        self.facade.debugAction('AuthActions.login %o', user)
        Cookies.set('Authorization', user.token)
        self.facade.setLoading(false)
        riot.route('/homepage')
        resolve()
      })
      .catch(function (error) {
        self.facade.setLoading(false)
        self.facade.debugAction('AuthActions.login (ERROR) %o', error)
        self.facade.trigger('EVENT_CALLER_ERROR', error)
        reject(error)
      })
  }) */
  }
}
