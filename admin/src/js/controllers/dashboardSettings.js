(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardSettingsController', [
    '$scope', 'dashBoardSettingsService', 'md5', '$auth', function($scope, dashBoardSettingsService, md5, $auth) {
      $scope.emails = null;
      $scope.updatePassword = function() {
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
      $scope.addEmail = function() {
        var data;
        data = {
          key: 'website_mail_destination',
          value: $scope.newEmail
        };
        return dashBoardSettingsService.addEmail(data).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            if (_.isNull($scope.emails)) {
              $scope.emails = {
                id: response.id,
                key: 'website_mail_destination',
                value: $scope.newEmail
              };
            } else {
              $scope.emails.push({
                id: response.id,
                key: 'website_mail_destination',
                value: $scope.newEmail
              });
            }
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.fetchEmail = function() {
        return dashBoardSettingsService.fetchEmail().then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.emails = response.results;
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      return $scope.deleteEmail = function(id) {
        var index;
        index = _.findIndex($scope.emails, {
          id: id
        });
        return dashBoardSettingsService.deleteEmail(id).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.emails.splice(index, 1);
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
