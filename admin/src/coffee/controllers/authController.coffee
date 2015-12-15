angular.module 'V12Admin.authentication', []
.controller 'authController', ['$scope', '$stateParams',
  ($scope, $stateParams)->
    if $stateParams.type is 'recovery' and !_.isUndefined($stateParams.value) and !_.isUndefined($stateParams.email)
      $scope.recovery_screen = true
      $scope.header = 'Reset Password'
    else
      $scope.recovery_screen = false
      $scope.header = 'Login'


    $scope.forgotPassword = false
    $scope.viewPass = false
    $scope.passType = 'password'
    $scope.passIcon = 'mdi-action-visibility-off'
    $scope.toggleShowPassword = ()->
      if ($scope.viewPass is false)
        $scope.viewPass = true
        $scope.passType = 'text'
        $scope.passIcon = 'mdi-action-visibility'
      else
        $scope.viewPass = false
        $scope.passType = 'password'
        $scope.passIcon = 'mdi-action-visibility-off'

    $scope.login = (user)->


    $scope.recoverPassword = (recovery)->


    $scope.toggleForgotPass = ->
      if($scope.forgotPassword is false)
        $scope.forgotPassword = true
        $scope.header = 'Recover Password'
      else
        $scope.forgotPassword = false
        $scope.header = 'Login'

    $scope.updatePassword = (new_pass) ->

]