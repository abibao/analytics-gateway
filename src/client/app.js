var tags = [
  'views/modules/login.tag',
  'views/modules/homepage.tag',
  'views/modules/entity.tag',
  'views/modules/charity.tag',
  'views/modules/campaign.tag',
  'views/modules/campaignItem.tag',
  'views/modules/campaignItemChoice.tag',
  'views/_layouts/loading.tag',
  'views/_layouts/error404.tag',
  'views/_layouts/navbar.tag'
]

var feathers = feathers()
  .configure(feathers.rest('http://localhost:5555').jquery(jQuery))
  .configure(feathers.hooks())
  .configure(feathers.authentication({ storage: window.localStorage }))

var facade = new Facade()

async.map(tags, function (item, next) {
  // preloading tags
  riot.compile(item, function () {
    next(null, item)
  })
}, function (err, results) {
  facade.debugHTML('auth.authentified %s', facade.stores.auth.authentified())

  // start application
  facade.debugHTML('mount')
  riot.mount('*', facade)

  // define routers
  var Route = riot.router.Route
  var DefaultRoute = riot.router.DefaultRoute
  var NotFoundRoute = riot.router.NotFoundRoute
  var RedirectRoute = riot.router.RedirectRoute

  // redirect unlogged users to /login page
  function securityFilter (request, response, next) {
    facade.debugHTML('securityFilter', request)
    try {
      return next()
    } finally {
      if (!facade.stores.auth.authentified() && request.uri !== '/login') {
        response.redirectTo = '/login'
      }
    }
  }

  // apply security filter to Riot-Router
  riot.router.use(securityFilter)

  // declare application routes
  facade.debugHTML('routes')
  riot.router.routes([
    new Route({path: '/login', tag: 'login'}),
    new Route({path: '/homepage', tag: 'homepage'}),
    new Route({path: '/entities/:urn', tag: 'entity'}),
    new Route({path: '/charities/:urn', tag: 'charity'}),
    new Route({path: '/campaigns/:urn', tag: 'campaign'}),
    new Route({path: '/campaigns-items/:urn', tag: 'campaign-item'}),
    new Route({path: '/campaigns-items-choices/:urn', tag: 'campaign-item-choice'}),
    new DefaultRoute({path: '/homepage', tag: 'homepage'}),
    new NotFoundRoute({path: '/404', tag: 'error404'})
  ])

  riot.router.start()
})
