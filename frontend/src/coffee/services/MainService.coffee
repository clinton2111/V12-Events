angular.module 'v12events.main'
.factory 'mainService', ['$http', '$q', 'API', ($http, $q, API)->
  return(

    fetchPhotos: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'frontendHandler.php'
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

    fetchVideos: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'frontendHandler.php'
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

    fetchTestimonials: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'frontendHandler.php'
        data:
          'location': 'fetch_testimonials'
          'offset': offset
        method: 'post'
        cache: true
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    sendEmail: (emailData)->
      q = $q.defer()
      emailData.location='send_mail'
      $http
        url: API.url + 'frontendHandler.php'
        data:emailData
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject error
      q.promise



  )
]