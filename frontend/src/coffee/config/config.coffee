angular.module 'V12Events', ['ui.router', 'v12events.main', 'duScroll']
.config ['$stateProvider', '$urlRouterProvider', '$locationProvider',
  ($stateProvider, $urlRouterProvider, $locationProvider)->
    $locationProvider.html5Mode(true)
    $stateProvider.state 'home',
      url: '/home'
      templateUrl: '/frontend/src/views/main.html'
      controller: 'mainController'
    $urlRouterProvider.otherwise '/home'

]