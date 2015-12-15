angular.module 'V12Admin.authentication', []
.controller 'authController', ['$scope', '$stateParams', 'md5', 'authFactory', '$auth','$state','$localStorage',
  ($scope, $stateParams, md5, authFactory, $auth,$state,$localStorage)->
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
      data =
        email: user.email
        password: md5.createHash(user.password || '')
        type: 'login'

      $auth.login data,[skipAuthorization: true]
      .then (data)->
        userData = data.data
        $localStorage.resetDate = moment().format('DD-MM-YYYY')
        Materialize.toast userData.message, '4000'
        $state.go 'dashboard.home'
      , (error)->
        Materialize.toast error.data.message, '4000'


    $scope.recoverPassword = (recovery)->
      authFactory.recoverPassword recovery
      .then (data)->
        response = data.data
        Materialize.toast response.message, 4000
      , (error)->
        Materialize.toast error.data.message, 4000


    $scope.toggleForgotPass = ->
      if($scope.forgotPassword is false)
        $scope.forgotPassword = true
        $scope.header = 'Recover Password'
      else
        $scope.forgotPassword = false
        $scope.header = 'Login'

    $scope.updatePassword = (new_pass) ->
      if new_pass.password is new_pass.cpassword
        data =
          password: md5.createHash(new_pass.password || '')
          email: $stateParams.email
          value: $stateParams.value
        authFactory.updatePassword(data)
        .then (data)->
          response = data.data
          Materialize.toast response.status + ' - ' + response.message, 4000
          $state.go 'auth', {type: 'login', email: null, value: null}
        , (error)->
          Materialize.toast('Opps something went wrong', 4000)
      else
        Materialize.toast('Passwords do not match', 4000)

]