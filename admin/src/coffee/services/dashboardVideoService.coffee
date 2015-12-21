angular.module 'V12Admin.dashBoardCtrl'
.factory 'dashBoardVideosService', ['$http', '$q', 'API', ($http, $q, API)->
  return(

    fetchVideos: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'videoHandler.php'
        data:
          'location': 'fetch_videos'
          'offset': offset
        method: 'post'
        cache: true
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    uploadVideo: (video_id)->
      q = $q.defer();
      $http
        url: API.url + 'videoHandler.php'
        data:
          video_id: video_id
          location: 'insert_video'
        method: 'POST'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    deleteVideo: (data)->
      data.location = 'delete_video'
      q = $q.defer();
      $http
        url: API.url + 'videoHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

  )
]