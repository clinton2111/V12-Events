(function() {
  angular.module('V12Events', ['ui.router', 'v12events.main', 'duScroll']).config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/frontend/src/views/main.html',
        controller: 'mainController'
      });
      return $urlRouterProvider.otherwise('/home');
    }
  ]);

}).call(this);
