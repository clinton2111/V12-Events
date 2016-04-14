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


    addEmail:(data)->
      data.location = 'add_email'
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

    fetchEmail:()->
      data=
        location : 'fetch_email'
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

    deleteEmail:(id)->
      data = 
        location:'delete_email'
        id:id
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