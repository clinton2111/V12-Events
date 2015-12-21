(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardSettingsController', [
    '$scope', 'dashBoardSettingsService', 'md5', '$auth', function($scope, dashBoardSettingsService, md5, $auth) {
      return $scope.updatePassword = function() {
        var data, payload;
        if ($scope.password["new"] !== $scope.password.confirm) {
          return Materialize.toast('New password and confirmation password do not match', 4000);
        } else {
          payload = $auth.getPayload();
          data = {
            currentPassword: md5.createHash($scope.password.current || ''),
            newPassword: md5.createHash($scope.password["new"] || ''),
            id: payload.id
          };
          return dashBoardSettingsService.updatePassword(data).then(function(data) {
            var response;
            response = data.data;
            if (response.status === 'Success') {
              return Materialize.toast(response.status + " - " + response.message, 4000);
            } else {
              return Materialize.toast(response.status + " - " + response.message, 4000);
            }
          }, function(error) {
            return Materialize.toast('Something went wrong', 4000);
          });
        }
      };
    }
  ]);

}).call(this);
