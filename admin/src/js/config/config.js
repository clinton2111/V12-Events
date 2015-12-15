(function() {
  angular.module('V12Admin', ['ui.router', 'V12Admin.authentication']).config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
      $stateProvider.state('auth', {
        url: '/auth/:type/:email/:value',
        templateUrl: '/admin/src/views/auth.html',
        controller: 'authController'
      });
      $urlRouterProvider.otherwise('/auth');
      return $urlRouterProvider.otherwise('/auth/login//');
    }
  ]);

}).call(this);
