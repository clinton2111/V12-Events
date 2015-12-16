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
