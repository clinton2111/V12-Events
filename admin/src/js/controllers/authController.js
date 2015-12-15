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
