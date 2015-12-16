angular.module 'V12Admin.dashBoardCtrl'
.factory 'dashBoardPhotosService', ['$http', '$q', 'API', 'Upload', ($http, $q, API, Upload)->
  return(

    uploadPhoto: (picData)->
      q = $q.defer();
      Upload.upload
        url: API.url + 'photoHandler.php'
        data:
          caption: picData.Caption
          location: 'photos_insert'
        method: 'POST'
        headers: {'Content-Type': picData.File.type}
        file: picData.File
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

  )
]