/*! v12events - v1.0.0 - 2015-12-16 */(function() {
  angular.module('V12Admin', ['ui.router', 'V12Admin.authentication', 'angular-md5', 'satellizer', 'ngStorage', 'V12Admin.dashBoardCtrl', 'ngFileUpload']).config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$authProvider', 'API', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $authProvider, API) {
      $stateProvider.state('auth', {
        url: '/auth/:type/:email/:value',
        templateUrl: '/admin/src/views/auth.html',
        controller: 'authController'
      }).state('dashboard', {
        url: '/dashboard',
        abstract: true,
        templateUrl: '/admin/src/views/dashboard.html',
        controller: 'dashBoardController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.home', {
        url: '',
        templateUrl: '/admin/src/views/dashboardHome.html',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.photos', {
        url: '/photos',
        templateUrl: '/admin/src/views/dashboardPhotos.html',
        controller: 'dashBoardPhotosController',
        data: {
          requiresLogin: true
        }
      });
      $urlRouterProvider.otherwise('/auth');
      $urlRouterProvider.when('dashboard', 'dashboard.home');
      $urlRouterProvider.otherwise('/auth/login//');
      $authProvider.loginUrl = API.url + 'auth.php';
      return $authProvider.tokenPrefix = 'v12events';
    }
  ]).constant('API', {
    url: '../api/'
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
            return $state.go('auth', {
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
              return refreshToken().then(function(data) {
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
      });
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.authentication', []).controller('authController', [
    '$scope', '$stateParams', 'md5', 'authFactory', '$auth', '$state', '$localStorage', function($scope, $stateParams, md5, authFactory, $auth, $state, $localStorage) {
      if ($stateParams.type === 'recovery' && !_.isUndefined($stateParams.value) && !_.isUndefined($stateParams.email)) {
        $scope.recovery_screen = true;
        $scope.header = 'Reset Password';
      } else {
        $scope.recovery_screen = false;
        $scope.header = 'Login';
      }
      $scope.forgotPassword = false;
      $scope.viewPass = false;
      $scope.passType = 'password';
      $scope.passIcon = 'mdi-action-visibility-off';
      $scope.toggleShowPassword = function() {
        if ($scope.viewPass === false) {
          $scope.viewPass = true;
          $scope.passType = 'text';
          return $scope.passIcon = 'mdi-action-visibility';
        } else {
          $scope.viewPass = false;
          $scope.passType = 'password';
          return $scope.passIcon = 'mdi-action-visibility-off';
        }
      };
      $scope.login = function(user) {
        var data;
        data = {
          email: user.email,
          password: md5.createHash(user.password || ''),
          type: 'login'
        };
        return $auth.login(data, [
          {
            skipAuthorization: true
          }
        ]).then(function(data) {
          var userData;
          userData = data.data;
          $localStorage.resetDate = moment().format('DD-MM-YYYY');
          Materialize.toast(userData.message, '4000');
          return $state.go('dashboard.home');
        }, function(error) {
          return Materialize.toast(error.data.message, '4000');
        });
      };
      $scope.recoverPassword = function(recovery) {
        return authFactory.recoverPassword(recovery).then(function(data) {
          var response;
          response = data.data;
          return Materialize.toast(response.message, 4000);
        }, function(error) {
          return Materialize.toast(error.data.message, 4000);
        });
      };
      $scope.toggleForgotPass = function() {
        if ($scope.forgotPassword === false) {
          $scope.forgotPassword = true;
          return $scope.header = 'Recover Password';
        } else {
          $scope.forgotPassword = false;
          return $scope.header = 'Login';
        }
      };
      return $scope.updatePassword = function(new_pass) {
        var data;
        if (new_pass.password === new_pass.cpassword) {
          data = {
            password: md5.createHash(new_pass.password || ''),
            email: $stateParams.email,
            value: $stateParams.value
          };
          return authFactory.updatePassword(data).then(function(data) {
            var response;
            response = data.data;
            Materialize.toast(response.status + ' - ' + response.message, 4000);
            return $state.go('auth', {
              type: 'login',
              email: null,
              value: null
            });
          }, function(error) {
            return Materialize.toast('Opps something went wrong', 4000);
          });
        } else {
          return Materialize.toast('Passwords do not match', 4000);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl', []).controller('dashBoardController', [
    '$scope', '$state', '$auth', '$localStorage', function($scope, $state, $auth, $localStorage) {
      var payload;
      $scope.$on('$viewContentLoaded', function() {
        return $(".button-collapse").sideNav({
          menuWidth: 300,
          closeOnClick: true
        });
      });
      payload = $auth.getPayload();
      $scope.username = payload.name;
      return $scope.logout = function() {
        $auth.logout();
        delete $localStorage.resetDate;
        $state.go('auth', {
          type: 'login',
          email: null,
          value: null
        });
        return Materialize.toast('You have been logged out', 4000);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardPhotosController', [
    '$scope', 'dashBoardPhotosService', function($scope, dashBoardPhotosService) {
      $scope.$on('$viewContentLoaded', function() {
        return $('.modal-trigger').leanModal();
      });
      return $scope.uploadPhoto = function(pic) {
        return dashBoardPhotosService.uploadPhoto(pic).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.pic = {};
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.authentication').factory('authFactory', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        recoverPassword: function(emailData) {
          var q;
          emailData.type = 'recoverPassword';
          q = $q.defer();
          $http({
            url: API.url + 'auth.php',
            method: 'POST',
            data: emailData,
            skipAuthorization: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        updatePassword: function(passwordData) {
          var q;
          passwordData.type = 'updatePassword';
          q = $q.defer();
          $http({
            url: API.url + 'auth.php',
            method: 'POST',
            data: passwordData,
            skipAuthorization: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardPhotosService', [
    '$http', '$q', 'API', 'Upload', function($http, $q, API, Upload) {
      return {
        uploadPhoto: function(picData) {
          var q;
          q = $q.defer();
          Upload.upload({
            url: API.url + 'photoHandler.php',
            data: {
              caption: picData.Caption,
              location: 'photos_insert'
            },
            method: 'POST',
            headers: {
              'Content-Type': picData.File.type
            },
            file: picData.File
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        }
      };
    }
  ]);

}).call(this);
