(function() {
  angular.module('V12Admin', ['ui.router', 'V12Admin.authentication', 'angular-md5', 'satellizer', 'ngStorage', 'V12Admin.dashBoardCtrl', 'ngFileUpload', 'angularLazyImg']).config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$authProvider', 'API', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $authProvider, API) {
      $stateProvider.state('auth', {
        url: '/auth/:type/:email/:value',
        templateUrl: API.views + 'auth.html',
        controller: 'authController'
      }).state('dashboard', {
        url: '/dashboard',
        abstract: true,
        templateUrl: API.views + 'dashboard.html',
        controller: 'dashBoardController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.home', {
        url: '',
        templateUrl: API.views + 'dashboardHome.html',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.photos', {
        url: '/photos',
        templateUrl: API.views + 'dashboardPhotos.html',
        controller: 'dashBoardPhotosController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.testimonials', {
        url: '/testimonials',
        templateUrl: API.views + 'dashboardTestimonials.html',
        controller: 'dashBoardTestimonialsController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.videos', {
        url: '/videos',
        templateUrl: API.views + 'dashboardVideos.html',
        controller: 'dashBoardVideosController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.settings', {
        url: '/settings',
        templateUrl: API.views + 'dashboardSettings.html',
        controller: 'dashBoardSettingsController',
        data: {
          requiresLogin: true
        }
      });
      $urlRouterProvider.otherwise('/auth');
      $urlRouterProvider.when('dashboard', 'dashboard.home');
      $urlRouterProvider.otherwise('/auth/login//');
      $authProvider.loginUrl = API.url + 'auth.php';
      $authProvider.tokenPrefix = 'v12events';
      return $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }
  ]).constant('API', {
    url: '../api/',
    views: '/admin/src/views/'
  }).run([
    '$rootScope', '$state', '$http', 'API', '$q', '$auth', '$localStorage', function($rootScope, $state, $http, API, $q, $auth, $localStorage) {
      return $rootScope.$on('$stateChangeStart', function(e, to) {
        var lastUpdate, refreshToken, refreshTokenFlag;
        refreshToken = function() {
          var q;
          q = $q.defer();
          $http.post(API.url + 'refreshToken.php', null).then(function(data) {
            return q.resolve(data.data);
          }, function(error) {
            console.log('Error');
            return q.reject(data);
          });
          return q.promise;
        };
        if (to.data && to.data.requiresLogin) {
          if ($auth.isAuthenticated() === false) {
            e.preventDefault();
            $state.go('auth', {
              type: 'login',
              email: null,
              value: null
            });
          } else {
            lastUpdate = null;
            if (_.isUndefined($localStorage.resetDate) === true) {
              lastUpdate = moment('21-11-1992', 'DD-MM-YYYY');
            } else {
              lastUpdate = moment($localStorage.resetDate, 'DD-MM-YYYY');
            }
            refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day');
            if (!refreshTokenFlag) {
              refreshToken().then(function(data) {
                var tokenData;
                tokenData = data;
                if (!(_.isNull(tokenData.token) && _.isUndefined(tokenData.token))) {
                  $auth.setToken(tokenData.token);
                  return $localStorage.resetDate = moment().format('DD-MM-YYYY');
                } else {
                  e.preventDefault();
                  return $state.go('auth', {
                    type: 'login',
                    email: null,
                    value: null
                  });
                }
              }, function(error) {
                return e.preventDefault();
              });
            }
          }
        }
        if ((to.templateUrl === API.views + 'auth.html') && ($auth.isAuthenticated() === true)) {
          e.preventDefault();
          return $state.go('dashboard.home');
        }
      });
    }
  ]).factory('authHttpResponseInterceptor', [
    '$q', '$location', function($q, $location) {
      return {
        response: function(response) {
          if (response.status === 401) {
            console.log("Response 401");
          }
          return response || $q.when(response);
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $location.path('/auth/login//').search('returnTo', $location.path());
          }
          return $q.reject(rejection);
        }
      };
    }
  ]);

}).call(this);
