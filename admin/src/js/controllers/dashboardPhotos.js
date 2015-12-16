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
