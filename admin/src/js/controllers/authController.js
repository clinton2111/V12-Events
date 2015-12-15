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
