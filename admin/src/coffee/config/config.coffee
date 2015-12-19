angular.module 'V12Admin', ['ui.router', 'V12Admin.authentication', 'angular-md5', 'satellizer', 'ngStorage',
                            'V12Admin.dashBoardCtrl', 'ngFileUpload']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$authProvider', 'API',
  ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $authProvider, API)->
    $stateProvider
    .state 'auth',
      url: '/auth/:type/:email/:value'
      templateUrl: API.views + 'auth.html'
      controller: 'authController'
    .state 'dashboard',
      url: '/dashboard'
      abstract: true
      templateUrl: API.views + 'dashboard.html'
      controller: 'dashBoardController'
      data:
        requiresLogin: true
    .state 'dashboard.home',
      url: ''
      templateUrl: API.views + 'dashboardHome.html'
      data:
        requiresLogin: true
    .state 'dashboard.photos',
      url: '/photos'
      templateUrl: API.views + 'dashboardPhotos.html'
      controller: 'dashBoardPhotosController'
      data:
        requiresLogin: true
    .state 'dashboard.testimonials',
      url: '/testimonials'
      templateUrl: API.views + 'dashboardTestimonials.html'
      controller: 'dashBoardTestimonialsController'
      data:
        requiresLogin: true


    $urlRouterProvider.otherwise '/auth'


    $urlRouterProvider.when 'dashboard', 'dashboard.home'
    $urlRouterProvider.otherwise '/auth/login//'

    $authProvider.loginUrl = API.url + 'auth.php'
    $authProvider.tokenPrefix = 'v12events'


]


.constant 'API',
  url: '../api/'
  views: '/admin/src/views/'

.run ['$rootScope', '$state', '$http', 'API', '$q', '$auth', '$localStorage',
  ($rootScope, $state, $http, API, $q, $auth, $localStorage)->
    $rootScope.$on '$stateChangeStart', (e, to)->
      refreshToken = ()->
        q = $q.defer()
        $http.post API.url + 'refreshToken.php', null
        .then (data)->
          q.resolve(data.data)
        , (error)->
          console.log 'Error'
          q.reject(data)
        q.promise


      if to.data && to.data.requiresLogin
        if $auth.isAuthenticated() is false
          e.preventDefault();
          $state.go 'auth', {type: 'login', email: null, value: null}
        else
          lastUpdate = null;
          if _.isUndefined($localStorage.resetDate) is true
            lastUpdate = moment('21-11-1992', 'DD-MM-YYYY')
          else
            lastUpdate = moment($localStorage.resetDate, 'DD-MM-YYYY')

          refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day')
          if !refreshTokenFlag
            refreshToken()
            .then (data)->
              tokenData = data
              if !(_.isNull(tokenData.token) and _.isUndefined(tokenData.token))
                $auth.setToken(tokenData.token)
                $localStorage.resetDate = moment().format('DD-MM-YYYY')
              else
                e.preventDefault()
                $state.go 'auth', {type: 'login', email: null, value: null}
            , (error)->
              e.preventDefault();


]