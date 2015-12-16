angular.module 'V12Admin.dashBoardCtrl', []
.controller 'dashBoardController', ['$scope', '$state', '$auth', '$localStorage',($scope, $state, $auth,$localStorage)->
  $scope.$on('$viewContentLoaded', ()->
    $ ".button-collapse"
    .sideNav
        menuWidth: 300
        closeOnClick: true
  );
  payload = $auth.getPayload()
  $scope.username = payload.name

  $scope.logout = ->
    $auth.logout();
    delete $localStorage.resetDate;
    $state.go 'auth', {type: 'login', email: null, value: null}
    Materialize.toast 'You have been logged out', 4000
]