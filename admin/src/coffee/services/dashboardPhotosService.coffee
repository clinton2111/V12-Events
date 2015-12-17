angular.module 'V12Admin.dashBoardCtrl'
.factory 'dashBoardPhotosService', ['$http', '$q', 'API', 'Upload', ($http, $q, API, Upload)->
  return(

    fetchPhotos: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'photoHandler.php'
        data:
          'location': 'fetch_photos'
          'offset': offset
        method: 'post'
        cache: true
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    uploadPhoto: (picData)->
      q = $q.defer();
      Upload.upload
        url: API.url + 'photoHandler.php'
        data:
          caption: picData.Caption
          location: 'insert_photos'
        method: 'POST'
        headers: {'Content-Type': picData.File.type}
        file: picData.File
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    updateCaption: (data)->
      data.location = 'update_caption'

      q = $q.defer();
      $http
        url: API.url + 'photoHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    deletePhoto: (data)->
      data.location = 'delete_photo'
      q = $q.defer();
      $http
        url: API.url + 'photoHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

  )
]