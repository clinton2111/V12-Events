angular.module 'V12Admin.dashBoardCtrl'
.factory 'dashBoardSettingsService', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    updatePassword: (data)->
      data.location = 'update_password'
      q = $q.defer();
      $http
        url: API.url + 'settingsHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

  )
]