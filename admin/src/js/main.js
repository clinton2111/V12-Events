/*! v12events - v1.0.0 - 2015-12-15 */(function() {
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

(function() {
  angular.module('V12Admin.authentication', []).controller('authController', [
    '$scope', '$stateParams', function($scope, $stateParams) {
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
      $scope.login = function(user) {};
      $scope.recoverPassword = function(recovery) {};
      $scope.toggleForgotPass = function() {
        if ($scope.forgotPassword === false) {
          $scope.forgotPassword = true;
          return $scope.header = 'Recover Password';
        } else {
          $scope.forgotPassword = false;
          return $scope.header = 'Login';
        }
      };
      return $scope.updatePassword = function(new_pass) {};
    }
  ]);

}).call(this);
