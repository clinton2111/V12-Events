(function() {
  angular.module('V12Events', ['ui.router', 'v12events.main', 'duScroll', 'angularLazyImg', 'vcRecaptcha']).config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', 'API', function($stateProvider, $urlRouterProvider, $locationProvider, API) {
      $locationProvider.html5Mode(true);
      $stateProvider.state('home', {
        url: '/home',
        templateUrl: API.views + 'main.html',
        controller: 'mainController'
      });
      return $urlRouterProvider.otherwise('/home');
    }
  ]).constant('API', {
    url: '../api/',
    views: '/frontend/src/views/',
    gCaptchaPublicKey: '6LdppxMTAAAAADqap2kMLOfXg2Cqk5O6MqP3qUOg'
  });

}).call(this);
